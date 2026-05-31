import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, AIProviderResponse } from '../../ai.provider';
import { config } from '../../../config';
import { AppError } from '../../errors';

export class GeminiAdapter implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor() {
    if (!config.ai.gemini) {
      throw new AppError('Gemini API Key not configured');
    }
    this.client = new GoogleGenerativeAI(config.ai.gemini);
  }

  async generateText(prompt: string, options: any = {}): Promise<AIProviderResponse> {
    try {
      const model = this.client.getGenerativeModel({ model: options.model || 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = result.response;

      return {
        content: response.text(),
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error: any) {
      throw new AppError(`Gemini Error: ${error.message}`, 500);
    }
  }
}
