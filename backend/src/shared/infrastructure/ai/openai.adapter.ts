import OpenAI from 'openai';
import { AIProvider, AIProviderResponse } from '../../ai.provider';
import { config } from '../../../config';
import { AppError } from '../../errors';

export class OpenAIAdapter implements AIProvider {
  private client: OpenAI | null = null;

  constructor() {
    if (config.ai.openai) {
      this.client = new OpenAI({ apiKey: config.ai.openai });
    }
  }

  async generateText(prompt: string, options: any = {}): Promise<AIProviderResponse> {
    if (!this.client) {
      console.warn('[AI]: OpenAI API Key not configured. Returning simulated response.');
      return this.simulateResponse(prompt);
    }

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

  private simulateResponse(prompt: string): AIProviderResponse {
    // Basic logic to return something useful for simulation
    let content = "Simulated AI Response: Key not configured.";

    if (prompt.includes('JSON')) {
      if (prompt.includes('tableName')) {
        content = JSON.stringify([
          { tableName: "sales", columns: [{ name: "id", type: "integer" }, { name: "amount", type: "decimal" }], rowCount: 150 },
          { tableName: "customers", columns: [{ name: "id", type: "integer" }, { name: "name", type: "string" }], rowCount: 45 }
        ]);
      } else {
        content = JSON.stringify({
          best_case: "Crecimiento del 20%",
          probable_case: "Crecimiento del 10%",
          worst_case: "Estancamiento"
        });
      }
    }

    return {
      content,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    };
  }
}
