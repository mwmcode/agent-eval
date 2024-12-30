import { dadJoke, dadJokeToolDefinition } from './dadJoke';
import { generateImage, generateImageToolDefinition } from './generateImage';
import { reddit, redditToolDefinition } from './reddit';
import { movieSearchToolDefinition, movieSearch } from './movieSearch';

export const tools = [
  dadJokeToolDefinition,
  generateImageToolDefinition,
  redditToolDefinition,
  movieSearchToolDefinition,
];

export {
  dadJoke,
  generateImage,
  reddit,
  dadJokeToolDefinition,
  generateImageToolDefinition,
  redditToolDefinition,
  movieSearch,
  movieSearchToolDefinition,
};
