import { saveToolResponse } from './memory';
import { showLoader } from './ui';
import { runTool } from './toolRunner';
import type { AIMessage } from './types';
import { generateImageToolDefinition } from './tools';
import { openai } from './ai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

export async function handleImageApprovalFlow(
  history: AIMessage[],
  userMessage: string,
): Promise<boolean | undefined> {
  const lastMessage = history.at(-1);
  const toolCall = lastMessage?.tool_calls?.[0];

  if (
    !toolCall ||
    toolCall.function.name !== generateImageToolDefinition.name
  ) {
    return false;
  }

  const loader = showLoader('Processing approval...');
  const approved = await runApprovalCheck(userMessage);

  loader.update(`executing tool: ${toolCall.function.name}`);
  const toolResponse = await runTool(toolCall, userMessage);
  loader.update(`done: ${toolCall.function.name}`);

  await saveToolResponse(
    toolCall.id,
    approved
      ? toolResponse
      : 'User did not approve image generation at this time.',
  );

  loader.stop();
  return true;
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
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  return result.choices[0].message.parsed?.approved;
}
