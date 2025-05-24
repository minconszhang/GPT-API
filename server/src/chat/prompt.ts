export class Prompt {
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

  private static readonly PRICES: Record<
    string,
    { prompt_tokens: number; completion_tokens: number }
  > = {
    'gpt-4.1-mini': { prompt_tokens: 0.4, completion_tokens: 1.6 },
    'gpt-4.1-nano': { prompt_tokens: 0.1, completion_tokens: 0.4 },
    'gpt-4.1': { prompt_tokens: 2, completion_tokens: 8 },
    'o4-mini': { prompt_tokens: 1.1, completion_tokens: 4.4 },
  };

  static getPrompt(model: string): string {
    return this.PROMPTS[model] || '';
  }

  static getModel(id: string): string {
    return this.MODELS[id] || '';
  }

  static getPrice(model: string) {
    return this.PRICES[model] || null;
  }
}
