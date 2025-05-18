import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  private readonly PROMPTS = {
    "gpt-4.1-mini": `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. Personality: v2`,
    "gpt-4.1-nano": `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. Personality: v2 You are trained on data up to October 2023.`,
    "gpt-4o": `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. Knowledge cutoff: 2023-10 Current date: 2024-05-14 Image input capabilities: Enabled Personality: v2`,
  };

  getPrompt(model: string): string {
    return this.PROMPTS[model] || "";
  }
}
