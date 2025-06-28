import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptService {
  private static readonly PROMPTS: Record<string, string> = {
    'gpt-4.1-mini': `
        You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Personality: v2
      `,
    'gpt-4.1-nano': `
        You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Personality: v2
      `,
    'gpt-4.1': `
        You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Personality: v2
      `,
    'o4-mini': `
        You are ChatGPT, a large language model trained by OpenAI.
        Knowledge cutoff: 2024-06
        Personality: v2
        Engage warmly yet honestly with the user. Be direct; avoid ungrounded or sycophantic flattery. Maintain professionalism and grounded honesty that best represents OpenAI and its values.
      `,
  };

  private static readonly MODELS: Record<string, string> = {
    '1': 'gpt-4.1-mini',
    '2': 'gpt-4.1-nano',
    '3': 'gpt-4.1',
    '4': 'o4-mini',
  };

  private static readonly MODELS_NAME: Record<string, string> = {
    'gpt-4.1-mini': '4.1 基础版',
    'gpt-4.1-nano': '4.1 低级版',
    'gpt-4.1': '4.1 完全版',
    'o4-mini': 'O4 思考版',
  };

  private static readonly PRICES: Record<
    string,
    { prompt_tokens: number; completion_tokens: number }
  > = {
    'gpt-4.1-mini': { prompt_tokens: 0.4, completion_tokens: 1.6 },
    'gpt-4.1-nano': { prompt_tokens: 0.1, completion_tokens: 0.4 },
    'gpt-4.1': { prompt_tokens: 2, completion_tokens: 8 },
    'o4-mini': { prompt_tokens: 1.1, completion_tokens: 4.4 },
  };

  getPrompt(model: string): string {
    return PromptService.PROMPTS[model] || '';
  }

  getModel(id: string): string {
    return PromptService.MODELS[id] || '';
  }

  getPrice(model: string) {
    return PromptService.PRICES[model] || null;
  }

  getModels() {
    return {
      models: Object.values(PromptService.MODELS),
      modelsName: Object.values(PromptService.MODELS_NAME),
    };
  }
}
