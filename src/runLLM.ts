import { openai } from './ai';
import { z } from 'zod';
import { zodFunction, zodResponseFormat } from 'openai/helpers/zod';
import { systemPrompt as defaultSystemPrompt } from './systemPrompt';
import type { RunLLMParams } from './types';
import { getSummary } from './memory';

export async function runLLM({
  messages,
  tools = [],
  temperature = 0.1,
  systemPrompt,
}: RunLLMParams) {
  const formattedTools = tools.map(zodFunction);
  const summary = await getSummary();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature,
    messages: [
      {
        role: 'system',
        content: `${
          systemPrompt || defaultSystemPrompt
        }. Conversation summary so far: ${summary}`,
      },
      ...messages,
    ],
    ...(formattedTools.length > 0 && {
      tools: formattedTools,
      tool_choice: 'auto',
      parallel_tool_calls: false,
    }),
  });

  return response.choices[0].message;
}
