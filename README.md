# StudyMate

StudyMate is a local-first study planner built with React, TypeScript, Vite, and Tailwind CSS. It brings daily tasks, subject progress, assignments, exams, a weekly schedule, study plans, and a lightweight study helper into one interface.

## Run locally

Requirements: Node.js 18 or later and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To create and preview a production build:

```bash
npm run build
npm run preview
```

Run the TypeScript check with `npm run typecheck`.

## Features

- Track subjects and completed topics, daily study tasks, assignments, and exams.
- Generate a seven-day revision plan based on your subjects, goal, available time, and exam date.
- Add weekly calendar blocks and check off plan tasks.
- Use the study helper for planning prompts, topic explanations, practice prompts, and simple summaries of pasted notes. It uses local rules and sentence extraction; it is not connected to a language model and does not provide generated subject expertise.
- Without Appwrite settings, planner data and chat history save in this browser using `localStorage`. With Appwrite configured, planner records sync to TablesDB and chat history remains local. The header shows the current sync state.

## Optional Appwrite TablesDB sync

The Web SDK uses only public project configuration in Vite variables. Do not put an Appwrite API key in this frontend. Copy `.env.example` to `.env.local`, then fill in the endpoint, project ID, database ID, and six table IDs. Until all values are present, StudyMate stays in local-only mode.

Create/configure resources in the Appwrite Console (StudyMate does not create or modify Appwrite resources):

1. Add the app's development and production origins as Web platforms in the Appwrite project.
2. Create a TablesDB database and these tables. Add every listed attribute with the specified Appwrite column type; all columns must exist before the client writes rows. Add a query index on `ownerId` for each table. `entityId` is a string used by StudyMate to map its local planner IDs to Appwrite's unique row IDs.
3. Turn **Row Security** on for every table. Grant table-level **CREATE** to `Users` (anonymous sessions count as users). Do not grant table-level read, update, or delete, and do not grant public/world access. The client adds read/update/delete permissions for the owning user on each new row.

| Table | Columns |
| --- | --- |
| Subjects | `ownerId` string, `entityId` string, `name` string, `completedTopics` integer, `totalTopics` integer, `color` string, `bgColor` string, `textColor` string, `icon` string |
| Today tasks | `ownerId` string, `entityId` string, `title` string, `duration` string, `completed` boolean |
| Assignments | `ownerId` string, `entityId` string, `title` string, `dueDate` string, `priority` string, `completed` boolean |
| Exams | `ownerId` string, `entityId` string, `title` string, `date` string, `daysLeft` integer |
| Calendar events | `ownerId` string, `entityId` string, `title` string, `dayIndex` integer, `startHour` float, `durationHours` float, `category` string, `timeLabel` string |
| Study plan | `ownerId` string, `entityId` string, `dayLabel` string, `dateLabel` string, `accentColor` string, `tasksJson` string |

The first successful connection loads existing rows per table. Empty tables are initialized from the current browser planner data; existing rows are kept and loaded. Reads are paginated, so collections can exceed one page. Anonymous identity is stored in the browser's Appwrite session. Clearing browser storage may lose access to that anonymous identity, so use a registered account flow if cross-device recovery is needed.

## Stack

- React 18 and TypeScript
- Vite 5
- Tailwind CSS 3
- Lucide icons
