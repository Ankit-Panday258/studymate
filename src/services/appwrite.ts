import { Account, AppwriteException, Client, ID, Permission, Query, Role, TablesDB } from 'appwrite';
import type { Subject, TodayTask, Assignment, Exam, CalendarEvent, StudyPlanDay } from '../types';

const env = import.meta.env;
const names = {
  endpoint: 'VITE_APPWRITE_ENDPOINT', project: 'VITE_APPWRITE_PROJECT_ID', database: 'VITE_APPWRITE_DATABASE_ID',
  subjects: 'VITE_APPWRITE_SUBJECTS_TABLE_ID', todayTasks: 'VITE_APPWRITE_TODAY_TASKS_TABLE_ID',
  assignments: 'VITE_APPWRITE_ASSIGNMENTS_TABLE_ID', exams: 'VITE_APPWRITE_EXAMS_TABLE_ID',
  calendarEvents: 'VITE_APPWRITE_CALENDAR_EVENTS_TABLE_ID', studyPlan: 'VITE_APPWRITE_STUDY_PLAN_TABLE_ID',
} as const;
type Collection = 'subjects'|'todayTasks'|'assignments'|'exams'|'calendarEvents'|'studyPlan';
const collectionNames: Collection[] = ['subjects','todayTasks','assignments','exams','calendarEvents','studyPlan'];
const tables: Record<Collection,string> = {
  subjects: env.VITE_APPWRITE_SUBJECTS_TABLE_ID, todayTasks: env.VITE_APPWRITE_TODAY_TASKS_TABLE_ID,
  assignments: env.VITE_APPWRITE_ASSIGNMENTS_TABLE_ID, exams: env.VITE_APPWRITE_EXAMS_TABLE_ID,
  calendarEvents: env.VITE_APPWRITE_CALENDAR_EVENTS_TABLE_ID, studyPlan: env.VITE_APPWRITE_STUDY_PLAN_TABLE_ID,
};
const required = [env.VITE_APPWRITE_ENDPOINT, env.VITE_APPWRITE_PROJECT_ID, env.VITE_APPWRITE_DATABASE_ID, ...collectionNames.map(k => tables[k])];
export const appwriteConfigured = required.every(Boolean);
export const appwriteMissing = [names.endpoint,names.project,names.database,...collectionNames.map(k => names[k])].filter((_, i) => !required[i]);

const client = appwriteConfigured ? new Client().setEndpoint(env.VITE_APPWRITE_ENDPOINT).setProject(env.VITE_APPWRITE_PROJECT_ID) : null;
const account = client ? new Account(client) : null;
const db = client ? new TablesDB(client) : null;
let ownerResolutionInFlight: Promise<string> | null = null;
export type PlannerData = { subjects: Subject[]; todayTasks: TodayTask[]; assignments: Assignment[]; exams: Exam[]; calendarEvents: CalendarEvent[]; studyPlan: StudyPlanDay[] };
export type SyncState = Pick<PlannerData, 'subjects'|'todayTasks'|'assignments'|'exams'|'calendarEvents'|'studyPlan'>;
const toData = (key: Collection, value: unknown): Record<string, unknown> => {
  if (key === 'studyPlan') {
    const { id, tasks, ...day } = value as StudyPlanDay;
    return { ...day, entityId: id, tasksJson: JSON.stringify(tasks) };
  }
  const { id, ...fields } = value as Record<string, unknown>;
  return { ...fields, entityId: id };
};
const fromRow = <T,>(key: Collection, row: Record<string, unknown>): T => {
  const { entityId, ownerId: _ownerId, ...data } = row;
  if (key === 'studyPlan') { const { tasksJson, ...day } = data; return { ...day, id: entityId, tasks: JSON.parse(String(tasksJson || '[]')) } as T; }
  return { ...data, id: entityId } as T;
};

async function listAllRows(tableId: string, ownerId: string) {
  if (!db) throw new Error('Appwrite is not configured.');
  const rows: Awaited<ReturnType<TablesDB['listRows']>>['rows'] = [];
  let cursor: string | undefined;
  while (true) {
    const queries = [Query.equal('ownerId', ownerId), Query.orderAsc('$id'), Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const page = await db.listRows(env.VITE_APPWRITE_DATABASE_ID, tableId, queries);
    rows.push(...page.rows);
    if (page.rows.length < 100) break;
    cursor = page.rows[page.rows.length - 1].$id;
  }
  return rows;
}

function resolveOwnerId(): Promise<string> {
  if (ownerResolutionInFlight) return ownerResolutionInFlight;
  if (!account) return Promise.reject(new Error('Appwrite is not configured.'));
  const request = (async () => {
    try { return (await account.get()).$id; }
    catch (error) {
      if (!(error instanceof AppwriteException) || error.code !== 401) throw error;
      return (await account.createAnonymousSession()).userId;
    }
  })();
  ownerResolutionInFlight = request;
  void request.finally(() => { if (ownerResolutionInFlight === request) ownerResolutionInFlight = null; }).catch(() => undefined);
  return request;
}

export async function connectAndLoad(): Promise<{ data: SyncState; ownerId: string }> {
  if (!account || !db) throw new Error('Appwrite is not configured.');
  const ownerId = await resolveOwnerId();
  const results = await Promise.all(collectionNames.map(key => listAllRows(tables[key], ownerId)));
  const data = Object.fromEntries(collectionNames.map((key, i) => [key, results[i].map(row => fromRow(key, row as unknown as Record<string, unknown>))]));
  return { data: data as SyncState, ownerId };
}
export async function saveCollection<K extends Collection>(key: K, items: SyncState[K], ownerId: string): Promise<void> {
  if (!db) throw new Error('Appwrite is not configured.');
  const current = await listAllRows(tables[key], ownerId);
  const currentByEntityId = new Map(current.map(row => [String((row as unknown as Record<string, unknown>).entityId), row]));
  const ids = new Set(items.map(item => item.id));
  await Promise.all(current.filter(row => !ids.has(String((row as unknown as Record<string, unknown>).entityId))).map(row => db!.deleteRow(env.VITE_APPWRITE_DATABASE_ID, tables[key], row.$id)));
  await Promise.all(items.map(item => {
    const data = { ...toData(key, item), ownerId };
    const existing = currentByEntityId.get(item.id);
    if (existing) return db!.updateRow(env.VITE_APPWRITE_DATABASE_ID, tables[key], existing.$id, data);
    return db!.createRow(env.VITE_APPWRITE_DATABASE_ID, tables[key], ID.unique(), data,
      [Permission.read(Role.user(ownerId)), Permission.update(Role.user(ownerId)), Permission.delete(Role.user(ownerId))]);
  }));
}
