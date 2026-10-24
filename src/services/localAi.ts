import type { MLCEngineInterface } from '@mlc-ai/web-llm';

export const STUDY_HELPER_MODEL = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

let engine: MLCEngineInterface | null = null;
let enginePromise: Promise<MLCEngineInterface> | null = null;
let worker: Worker | null = null;

export async function loadLocalStudyModel(onProgress: (message: string) => void): Promise<void> {
  if (engine) return;
  if (enginePromise) {
    await enginePromise;
    return;
  }

  if (!(navigator as Navigator & { gpu?: unknown }).gpu) {
    throw new Error('This browser does not support WebGPU. Use a recent Chrome browser on a compatible device.');
  }

  enginePromise = (async () => {
    const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
    worker = new Worker(new URL('../workers/study-helper.worker.ts', import.meta.url), { type: 'module' });
    engine = await CreateWebWorkerMLCEngine(worker, STUDY_HELPER_MODEL, {
      initProgressCallback: (report) => onProgress(report.text),
    });
    return engine;
  })();

  try {
    await enginePromise;
  } catch (error) {
    worker?.terminate();
    worker = null;
    engine = null;
    throw error;
  } finally {
    enginePromise = null;
  }
}

export async function generateStudyReply(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<string> {
  if (!engine) throw new Error('The on-device AI model is not ready.');

  const response = await engine.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are StudyMate, a friendly study tutor. Help students understand concepts, make realistic study plans, summarize notes, and create practice questions. Reply in the same language as the student. Be clear and concise, use numbered steps when helpful, answer general study questions from your knowledge, and say when you are uncertain. Do not invent citations or claim to know details about the student’s course that were not provided.',
      },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  const content = response.choices[0]?.message.content;
  if (typeof content === 'string' && content.trim()) return content.trim();
  if (Array.isArray(content)) {
    const text = content.map((part) => 'text' in part ? part.text : '').join('').trim();
    if (text) return text;
  }
  throw new Error('The model returned an empty answer. Please try again.');
}

export function isLocalStudyModelReady(): boolean {
  return engine !== null;
}
