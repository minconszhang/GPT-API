import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { Prompt } from './prompt';

import type { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class ChatService {
  private readonly client = new OpenAI();
  private readonly conversations: Record<string, ChatCompletionMessageParam[]> =
    {};
  private readonly tokenUsage: Record<
    string,
    { promptTokens: number; completionTokens: number }
  > = {};
  private readonly cost: Record<string, number> = {};

  async processChat(
    model: string,
    userMessage: string,
    conversationId?: string,
  ) {
    if (!model || !userMessage) {
      throw new BadRequestException('model and userMessage are required');
    }

    let convId = conversationId;
    if (!convId) {
      convId = uuidv4();
      this.conversations[convId] = [
        { role: 'system', content: Prompt.getPrompt(model) },
      ];
      this.tokenUsage[convId] = { promptTokens: 0, completionTokens: 0 };
      this.cost[convId] = 0;
    }

    if (!this.tokenUsage[convId]) {
      this.tokenUsage[convId] = { promptTokens: 0, completionTokens: 0 };
    }

    if (!this.cost[convId]) {
      this.cost[convId] = 0;
    }

    const history = this.conversations[convId] || [];
    history.push({ role: 'user', content: userMessage });

    const response = await this.client.chat.completions.create({
      model,
      messages: history,
    });

    const botMsg = response.choices[0].message.content;
    history.push({ role: 'assistant', content: botMsg });

    this.conversations[convId] = history;

    const currentPromptTokens = response.usage?.prompt_tokens ?? 0;
    const currentCompletionTokens = response.usage?.completion_tokens ?? 0;

    this.tokenUsage[convId].promptTokens += currentPromptTokens;
    this.tokenUsage[convId].completionTokens += currentCompletionTokens;

    this.cost[convId] +=
      (currentPromptTokens * Prompt.getPrice(model).prompt_tokens) / 1000000;
    this.cost[convId] +=
      (currentCompletionTokens * Prompt.getPrice(model).completion_tokens) /
      1000000;

    Logger.log(
      `Model: ${model}, Prompt Tokens: ${currentPromptTokens}, Completion Tokens: ${currentCompletionTokens}, Cost: ${this.cost[convId].toFixed(6)}`,
      'ChatService',
    );

    return {
      conversationId: convId,
      message: botMsg,
      promptTokens: this.tokenUsage[convId].promptTokens,
      completionTokens: this.tokenUsage[convId].completionTokens,
    };
  }
}
