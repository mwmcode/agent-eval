import type { ChatCompletionMessage } from 'openai/resources/index.mjs';
import { runLLM } from '../../src/runLLM';
import { generateImageToolDefinition } from '../../src/tools';
import { runEval } from '../evalTools';
import { ToolCallMatch } from '../scorers';
import { createToolCallMessage } from '../createToolCallMessage';

runEval<ChatCompletionMessage>('generateImage', {
  task: input =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [generateImageToolDefinition],
    }),
  data: [
    {
      input: 'generate an image of a sunset over an active volcano',
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
    {
      input: 'take a picture of a sunset',
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],
});
