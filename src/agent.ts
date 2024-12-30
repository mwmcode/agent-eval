import { addMessages, getMessages, saveToolResponse } from './memory';
import { runLLM } from './runLLM';
import { showLoader, logMessage } from './ui';
import { runTool } from './toolRunner';

export function runAgent({
  userMessage,
  tools,
}: {
  userMessage: string;
  tools: any[];
}) {
  return (async function () {
    await addMessages([{ role: 'user', content: userMessage }]);

    const loader = showLoader('🤔');

    while (true) {
      const history = await getMessages();
      const response = await runLLM({ messages: history, tools });

      await addMessages([response]);

      if (response.content) {
        loader.stop();
        logMessage(response);
        return getMessages();
      }

      if (response.tool_calls) {
        const toolCall = response.tool_calls[0];
        logMessage(response);
        loader.update(`executing: ${toolCall.function.name}`);

        const toolResponse = await runTool(toolCall, userMessage);
        await saveToolResponse(toolCall.id, toolResponse);
        loader.update(`done: ${toolCall.function.name}`);
      }
    }
  })();
}
