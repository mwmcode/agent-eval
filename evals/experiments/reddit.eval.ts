import type { ChatCompletionMessage } from 'openai/resources/index.mjs';
import { runLLM } from '../../src/runLLM';
import { redditToolDefinition } from '../../src/tools';
import { runEval } from '../evalTools';
import { ToolCallMatch } from '../scorers';
import { createToolCallMessage } from '../createToolCallMessage';

runEval<ChatCompletionMessage>('reddit', {
  task: input =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [redditToolDefinition],
    }),
  data: [
    {
      input:
        'find me an interesting trending topic on the front page of the internet',
      expected: createToolCallMessage(redditToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],
});
