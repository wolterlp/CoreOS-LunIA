export interface AIProviderResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  generateText(prompt: string, options?: any): Promise<AIProviderResponse>;
}
