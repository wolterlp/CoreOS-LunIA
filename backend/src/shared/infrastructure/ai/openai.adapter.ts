import OpenAI from 'openai';
import { AIProvider, AIProviderResponse } from '../../ai.provider';
import { config } from '../../../config';
import { AppError } from '../../errors';

export class OpenAIAdapter implements AIProvider {
  private client: OpenAI;

  constructor() {
    if (!config.ai.openai) {
      throw new AppError('OpenAI API Key not configured');
    }
    this.client = new OpenAI({ apiKey: config.ai.openai });
  }

  async generateText(prompt: string, options: any = {}): Promise<AIProviderResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        ...options,
      });

      return {
        content: response.choices[0]?.message?.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      throw new AppError(`OpenAI Error: ${error.message}`, 500);
    }
  }
}
