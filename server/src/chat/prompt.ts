export class Prompt {
  private static readonly PROMPTS: Record<string, string> = {
    'gpt-4.1-mini': `
        You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Personality: v2
      `,
    'gpt-4.1-nano': `
        You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Personality: v2
        You are trained on data up to October 2023.
      `,
    'gpt-4o': `
        You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.
        Knowledge cutoff: 2023-10
        Current date: 2024-05-14
        Image input capabilities: Enabled
        Personality: v2
      `,
  };

  private static readonly MODELS: Record<string, string> = {
    '1': 'gpt-4.1-mini',
    '2': 'gpt-4.1-nano',
  };

  private static readonly PRICES: Record<
    string,
    { prompt_tokens: number; completion_tokens: number }
  > = {
    'gpt-4.1-mini': { prompt_tokens: 0.4, completion_tokens: 1.6 },
    'gpt-4.1-nano': { prompt_tokens: 0.1, completion_tokens: 0.4 },
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
