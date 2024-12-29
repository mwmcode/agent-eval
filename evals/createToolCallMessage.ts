import type { ChatCompletionMessage } from 'openai/resources/index.mjs';

export function createToolCallMessage(toolName: string): ChatCompletionMessage {
  return {
    content: null,
    refusal: null,
    role: 'assistant',
    tool_calls: [
      {
        id: '',
        type: 'function',
        function: { name: toolName, arguments: '' },
      },
    ],
  };
}
