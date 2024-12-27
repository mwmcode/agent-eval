import type { AIMessage } from '../types';
import { addMessages, getMessages, saveToolResponse } from './memory';
import { runApprovalCheck, runLLM } from './llm';
import { showLoader, logMessage } from './ui';
import { runTool } from './toolRunner';
import { generateImageToolDefinition } from './tools/generateImage';
import type { RunAgentEvalParams, RunAgentParams } from './types';

async function handleImageApprovalFlow(
  history: AIMessage[],
  userMessage: string,
) {
  const lastMessage = history[history.length - 1];
  const toolCall = lastMessage?.tool_calls?.[0];

  if (
    !toolCall ||
    toolCall.function.name !== generateImageToolDefinition.name
  ) {
    return false;
  }

  const loader = showLoader('Processing approval...');
  const approved = await runApprovalCheck(userMessage);

  if (approved) {
    loader.update(`executing tool: ${toolCall.function.name}`);
    const toolResponse = await runTool(toolCall, userMessage);

    loader.update(`done: ${toolCall.function.name}`);
    await saveToolResponse(toolCall.id, toolResponse);
  } else {
    await saveToolResponse(
      toolCall.id,
      'User did not approve image generation at this time.',
    );
  }

  loader.stop();

  return true;
}

export async function runAgent({
  turns = 10,
  userMessage,
  tools = [],
}: RunAgentParams) {
  await addMessages([{ role: 'user', content: userMessage }]);
  const loader = showLoader('🤔');
  while (true) {
    const history = await getMessages();
    const response = await runLLM({ messages: history, tools });

    await addMessages([response]);

    if (response.content) {
      loader.stop();
      logMessage(response);
      return await getMessages();
    }

    if (response.tool_calls) {
      const toolCall = response.tool_calls[0];
      logMessage(response);
      loader.update(`⌛ executing: ${toolCall.function.name}`);
      const toolResponse = await runTool(toolCall, userMessage);
      await saveToolResponse(toolCall.id, toolResponse);
      loader.update(`✅ done: ${toolCall.function.name}`);
    }
  }
}

export async function runAgentEval({ userMessage, tools }: RunAgentEvalParams) {
  let messages: AIMessage[] = [{ role: 'user', content: userMessage }];

  while (true) {
    const response = await runLLM({ messages, tools });
    messages = [...messages, response];

    if (response.content) {
      return messages;
    }

    if (response.tool_calls) {
      const toolCall = response.tool_calls[0];

      if (toolCall.function.name === generateImageToolDefinition.name) {
        return messages;
      }

      const toolResponse = await runTool(toolCall, userMessage);
      messages = [
        ...messages,
        { role: 'tool', content: toolResponse, tool_call_id: toolCall.id },
      ];
    }
  }
}
