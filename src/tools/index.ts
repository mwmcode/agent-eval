import { dadJoke, dadJokeToolDefinition } from './dadJoke';
import { generateImage, generateImageToolDefinition } from './generateImage';
import { reddit, redditToolDefinition } from './reddit';

export const tools = [
  dadJokeToolDefinition,
  generateImageToolDefinition,
  redditToolDefinition,
];

export {
  dadJoke,
  generateImage,
  reddit,
  dadJokeToolDefinition,
  generateImageToolDefinition,
  redditToolDefinition,
};
