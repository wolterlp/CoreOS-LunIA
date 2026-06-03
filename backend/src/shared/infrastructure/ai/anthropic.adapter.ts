import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AIProviderResponse } from '../../ai.provider';
import { config } from '../../../config';
import { AppError } from '../../errors';

export class AnthropicAdapter implements AIProvider {
  private client: Anthropic | null = null;

  constructor() {
    if (config.ai.anthropic) {
      this.client = new Anthropic({ apiKey: config.ai.anthropic });
    }
  }

  async generateText(prompt: string, options: any = {}): Promise<AIProviderResponse> {
    if (!this.client) {
      console.warn('[AI]: Anthropic API Key not configured. Returning simulated response.');
      return this.simulateResponse(prompt);
    }

    try {
      const response = await this.client.messages.create({
        model: options.model || 'claude-3-sonnet-20241022',
        max_tokens: options.maxTokens || 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => (block as { text: string }).text)
        .join('');

      return {
        content,
        usage: {
          promptTokens: response.usage?.input_tokens || 0,
          completionTokens: response.usage?.output_tokens || 0,
          totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
        },
      };
    } catch (error: any) {
      throw new AppError(`Anthropic Error: ${error.message}`, 500);
    }
  }

  private simulateResponse(prompt: string): AIProviderResponse {
    let content = "Simulated Anthropic Response: Key not configured.";

    if (prompt.includes('JSON')) {
      content = JSON.stringify({ result: "Anthropic simulated data" });
    }

    return {
      content,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    };
  }
}
