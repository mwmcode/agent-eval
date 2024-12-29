import { openai } from '../ai';
import { z } from 'zod';
import type { ToolFnParams } from '../types';

export const generateImageToolDefinition = {
  name: 'generate_image',
  parameters: z
    .object({
      prompt: z
        .string()
        .describe(
          "The prompt to use to generate the image with a diffusion model image generator like Dall-E. Consider the user's input and generate an image based on that. If unsure, you can ask the user to provide more details.",
        ),
    })
    .describe('Generates an image and returns the url of the image.'),
};

type Args = z.infer<typeof generateImageToolDefinition.parameters>;

export async function generateImage({
  toolArgs,
}: ToolFnParams<Args>): Promise<string> {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: toolArgs.prompt,
    n: 1,
    size: '1024x1024',
  });

  const imageUrl = response.data[0].url!;

  return imageUrl;
}
