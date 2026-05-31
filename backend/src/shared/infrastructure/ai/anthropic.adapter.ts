import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AIProviderResponse } from '../../ai.provider';
import { config } from '../../../config';
import { AppError } from '../../errors';

export class AnthropicAdapter implements AIProvider {
  private client: Anthropic;

  constructor() {
    if (!config.ai.anthropic) {
      throw new AppError('Anthropic API Key not configured');
    }
    this.client = new Anthropic({ apiKey: config.ai.anthropic });
  }

  async generateText(prompt: string, options: any = {}): Promise<AIProviderResponse> {
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
}
