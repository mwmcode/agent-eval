import { z } from 'zod';
import fetch from 'node-fetch';
import type { ToolFnParams } from '../types';

export const redditToolDefinition = {
  name: 'reddit',
  parameters: z
    .object({})
    .describe(
      'Use this tool to get the latest posts from Reddit. It will return a JSON object with the title, link, subreddit, author, and upvotes of each post.',
    ),
};

type Args = z.infer<typeof redditToolDefinition.parameters>;

export async function reddit(_params: ToolFnParams<Args>): Promise<string> {
  const { data } = await (await fetch('https://www.reddit.com/.json')).json();

  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }));

  return JSON.stringify(relevantInfo, null, 2);
}
