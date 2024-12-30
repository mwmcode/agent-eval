import type OpenAI from 'openai';
import {
  generateImage,
  generateImageToolDefinition,
  redditToolDefinition,
  dadJokeToolDefinition,
  movieSearchToolDefinition,
  reddit,
  dadJoke,
  movieSearch,
} from './tools';

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string,
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  };

  switch (toolCall.function.name) {
    case generateImageToolDefinition.name:
      return generateImage(input);

    case redditToolDefinition.name:
      return reddit(input);

    case dadJokeToolDefinition.name:
      return dadJoke(input);

    case movieSearchToolDefinition.name:
      return movieSearch(input);

    default:
      return `Never run this tool: ${toolCall.function.name} again! 😠`;
  }
};
