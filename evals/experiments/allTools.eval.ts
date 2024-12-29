import type { ChatCompletionMessage } from 'openai/resources/index.mjs';
import { runLLM } from '../../src/runLLM';
import {
  tools,
  generateImageToolDefinition,
  dadJokeToolDefinition,
  redditToolDefinition,
} from '../../src/tools';
import { runEval } from '../evalTools';
import { ToolCallMatch } from '../scorers';
import { createToolCallMessage } from '../createToolCallMessage';

runEval<ChatCompletionMessage>('allTools', {
  task: input =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools,
    }),
  data: [
    {
      input: 'tell me a joke',
      expected: createToolCallMessage(dadJokeToolDefinition.name),
    },
    {
      input: 'generate an image of the sun and Mars',
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
    {
      input: 'get me the top trending post from reddit',
      expected: createToolCallMessage(redditToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],
});
