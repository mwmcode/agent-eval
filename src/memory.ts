import { JSONFilePreset } from 'lowdb/node';
import type { AIMessage, DataT, MessageWithMetadata } from './types';
import { summarizeHistory } from './summarizeHistory';
import * as crypto from 'crypto';

export function addMetadata(message: AIMessage): MessageWithMetadata {
  return {
    ...message,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

export function removeMetadata(message: MessageWithMetadata): AIMessage {
  // deno-lint-ignore no-unused-vars
  const { id, createdAt, ...messageWithoutMetadata } = message;
  return messageWithoutMetadata;
}

export async function getDb() {
  const db = await JSONFilePreset<DataT>('db.json', {
    messages: [],
    summary: '',
  });
  return db;
}

export async function addMessages(messages: AIMessage[]) {
  const db = await getDb();
  db.data.messages.push(...messages.map(addMetadata));
  if (db.data.messages.length >= 10) {
    const oldestMessages = db.data.messages.slice(0, 5).map(removeMetadata);
    db.data.summary = await summarizeHistory(oldestMessages);
  }
  await db.write();
}

export async function saveToolResponse(toolCallId: string, content: string) {
  return await addMessages([
    { role: 'tool', content, tool_call_id: toolCallId },
  ]);
}

export async function getMessages() {
  const db = await getDb();
  const messages = db.data.messages.map(removeMetadata);
  const latestMessages = messages.slice(-5);

  // If first message is a tool response, get one more message before it
  if (latestMessages[0]?.role === 'tool') {
    const sixthMessage = messages.at(-6);
    if (sixthMessage) {
      return [...[sixthMessage], ...latestMessages];
    }
  }

  return latestMessages;
}

export async function getSummary() {
  const db = await getDb();
  return db.data.summary;
}
