import { z } from 'zod';
import fetch from 'node-fetch';
import { ToolFnParams } from '../types';

export const dadJokeToolDefinition = {
  name: 'dad_joke',
  parameters: z.object({}),
  description: 'Get a dad joke',
};

type Args = z.infer<typeof dadJokeToolDefinition.parameters>;

export async function dadJoke(_params: ToolFnParams<Args>): Promise<string> {
  const res = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  });
  return (await res.json()).joke;
}
