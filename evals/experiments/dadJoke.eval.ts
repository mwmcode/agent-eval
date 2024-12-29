import type { ChatCompletionMessage } from 'openai/resources/index.mjs';
import { runLLM } from '../../src/runLLM';
import { dadJokeToolDefinition } from '../../src/tools';
import { runEval } from '../evalTools';
import { ToolCallMatch } from '../scorers';
import { createToolCallMessage } from '../createToolCallMessage';

runEval<ChatCompletionMessage>('dadJoke', {
  task: input =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [dadJokeToolDefinition],
    }),
  data: [
    {
      input: 'tell me a dad joke',
      expected: createToolCallMessage(dadJokeToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],
});
