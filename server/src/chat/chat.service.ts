import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { PromptService } from '../llm/llm.service';
import { DbService } from 'src/db/db.service';
import axios from 'axios';
import { Response } from 'express';

@Injectable()
export class ChatService {
  constructor(private readonly prompts: PromptService, private readonly dbService: DbService) { }

  private readonly client = new OpenAI();

  async processChatStream(
    res: Response,
    model: string,
    userMessage: string,
    conversationId?: string,
    userId?: string,
  ) {
    if (!model || !userMessage) {
      throw new BadRequestException('model and userMessage are required');
    }

    const pool = this.dbService.getPool();

    // TODO: support multiple users in the future
    if (!userId) {
      userId = '1';
    }

    let convId = '';
    if (!conversationId) {
      // Create a new conversation
      const query = `INSERT INTO conversations (user_id) VALUES ($1) RETURNING id`;
      const result = await pool.query(query, [userId]);
      convId = result.rows[0].id;

      // Insert system message
      const query2 = `INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)`;
      await pool.query(query2, [convId, 'system', this.prompts.getPromptFromModelName(model)]);
    } else {
      convId = conversationId;
    }

    // Insert user message
    const query3 = `SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`;
    const history = await pool.query(query3, [convId]);

    const historyMessages = history.rows.map((row) => ({
      role: row.role,
      content: row.content,
    }));

    historyMessages.push({
      role: 'user',
      content: userMessage,
    });

    let fullContent = '';
    if (model === '千问免费版') {
      const response = await axios.post(
        'http://localhost:1234/v1/chat/completions',
        {
          model: this.prompts.getModelFromModelName(model),
          messages: historyMessages,
          stream: true,
        },
        { responseType: 'stream' },
      );

      for await (const chunk of response.data) {
        const text = chunk.toString('utf-8');
        const lines = text.split('\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
          const jsonStr = line.replace(/^data:\s*/, '');
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;

            if (delta) {
              fullContent += delta;
              res.write(`data: ${delta}\n\n`);
            }
          } catch (err) {
            Logger.warn('Error parsing JSON:', jsonStr);
          }
        }
      }
    } else {
      const response = await this.client.chat.completions.create({
        model: this.prompts.getModelFromModelName(model),
        messages: historyMessages,
        stream: true,
      });

      for await (const chunk of response) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          res.write(`data: ${delta}\n\n`);
        }
      }
    }

    res.write(`event: meta\ndata: ${JSON.stringify({ conversationId: convId, })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();

    void this.saveUserMessage(convId, userMessage);
    void this.saveAssistantMessage(convId, fullContent, 0, 0, model);
  }

  private async saveUserMessage(convId: string, content: string) {
    try {
      const pool = this.dbService.getPool();
      await pool.query(
        'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
        [convId, 'user', content],
      );
    } catch (err) {
      Logger.error('Failed to insert user message', err);
    }
  }

  private async saveAssistantMessage(convId: string, content: string, inputTokens: number, outputTokens: number, model: string) {
    try {
      const pool = this.dbService.getPool();
      const modelPrice = this.prompts.getPrice(this.prompts.getModelFromModelName(model));
      const cost = (inputTokens * modelPrice.prompt_tokens + outputTokens * modelPrice.completion_tokens) / 1000000;

      await pool.query(
        'INSERT INTO messages (conversation_id, role, content, input_tokens, output_tokens, cost) VALUES ($1, $2, $3, $4, $5, $6)',
        [convId, 'assistant', content, inputTokens, outputTokens, cost],
      );
    } catch (err) {
      Logger.error('Failed to insert assistant message', err);
    }
  }
}
