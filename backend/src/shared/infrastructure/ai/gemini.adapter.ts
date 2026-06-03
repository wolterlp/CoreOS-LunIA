import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, AIProviderResponse } from '../../ai.provider';
import { config } from '../../../config';
import { AppError } from '../../errors';

export class GeminiAdapter implements AIProvider {
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    if (config.ai.gemini) {
      this.client = new GoogleGenerativeAI(config.ai.gemini);
    }
  }

  async generateText(prompt: string, options: any = {}): Promise<AIProviderResponse> {
    if (!this.client) {
      console.warn('[AI]: Gemini API Key not configured. Returning simulated response.');
      return this.simulateResponse(prompt);
    }

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

  private simulateResponse(prompt: string): AIProviderResponse {
    let content = "Simulated Gemini Response: Key not configured.";

    if (prompt.includes('JSON')) {
      if (prompt.includes('tableName')) {
        content = JSON.stringify([
          { tableName: "sales_gemini", columns: [{ name: "id", type: "integer" }], rowCount: 100 }
        ]);
      } else {
        content = JSON.stringify({ result: "Gemini simulated data" });
      }
    }

    return {
      content,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    };
  }
}
