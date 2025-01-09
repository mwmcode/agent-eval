import { openai } from './ai';
import { z } from 'zod';
import { zodFunction, zodResponseFormat } from 'openai/helpers/zod';
import { systemPrompt as defaultSystemPrompt } from './systemPrompt';
import type { RunLLMParams } from './types';

export async function runLLM({
  messages,
  tools = [],
  temperature = 0.1,
  systemPrompt,
}: RunLLMParams) {
  const formattedTools = tools.map(zodFunction);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature,
    messages: [
      {
        role: 'system',
        content: systemPrompt || defaultSystemPrompt,
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

export async function runApprovalCheck(userMessage: string) {
  const result = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    response_format: zodResponseFormat(
      z.object({
        approved: z
          .boolean()
          .describe('did the user approve the action or not'),
      }),
      'approval', // name of schema
    ),
    messages: [
      {
        role: 'system',
        content:
          'Determine if the user approved the image generation. If you are not sure, then it is not approved.',
      },
      { role: 'user', content: userMessage },
    ],
  });

  return result.choices[0].message.parsed?.approved;
}
