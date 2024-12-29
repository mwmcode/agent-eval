export function ToolCallMatch({ output, expected }: { output: any; expected: any }): Promise<{ name: string; score: number }> {
  const score =
    output.role === 'assistant' &&
    Array.isArray(output.tool_calls) &&
    output.tool_calls.length === 1 &&
    output.tool_calls[0].function?.name ===
      expected.tool_calls[0].function?.name
      ? 1
      : 0

  return Promise.resolve({
    name: 'ToolCallMatch',
    score,
  })
}
