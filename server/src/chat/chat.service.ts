import { BadRequestException, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { Prompt } from './prompt';

import type { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class ChatService {
  private readonly client = new OpenAI();
  private readonly conversations: Record<string, ChatCompletionMessageParam[]> =
    {};
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

    return {
      conversationId: convId,
      message: botMsg,
      promptTokens: response.usage?.prompt_tokens ?? 0,
      completionTokens: response.usage?.completion_tokens ?? 0,
    };
  }
}
