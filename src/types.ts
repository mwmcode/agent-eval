import OpenAI from 'openai';

export type AIMessage =
  | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
  | { role: 'user'; content: string }
  | { role: 'tool'; content: string; tool_call_id: string };

export interface ToolFn<A = any, T = any> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>;
}

export type ToolFnParams<A> = { userMessage: string; toolArgs: A };

export type MessageWithMetadata = AIMessage & {
  id: string;
  createdAt: string;
};

export type DataT = {
  messages: MessageWithMetadata[];
};

export type ToolT = OpenAI.ChatCompletionTool;

export type RunLLMParams = {
  messages: AIMessage[];
  tools?: any[];
  temperature?: number;
  systemPrompt?: string;
};

export type RunAgentParams = {
  turns: number;
  userMessage: string;
  tools: ToolT[];
};

export type RunAgentEvalParams = {
  userMessage: string;
  tools: any[];
};
