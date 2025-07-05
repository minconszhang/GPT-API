import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { PromptService } from '../llm/llm.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ChatService {
  constructor(private readonly prompts: PromptService, private readonly dbService: DbService) { }

  private readonly client = new OpenAI();

  async processChat(
    model: string,
    userMessage: string,
    conversationId?: string,
    userId?: string,
  ) {
    if (!model || !userMessage) {
      throw new BadRequestException('model and userMessage are required');
    }

    // TODO: support multiple users in the future
    if (!userId) {
      userId = '1';
    }

    const pool = this.dbService.getPool();

    let convId = '';
    if (!conversationId) {
      const query = `INSERT INTO conversations (user_id) VALUES ($1) RETURNING id`;
      const result = await pool.query(query, [userId]);
      convId = result.rows[0].id;

      const query2 = `INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)`;
      await pool.query(query2, [convId, 'system', this.prompts.getPromptFromModelName(model)]);
    } else {
      convId = conversationId;
    }

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

    const response = await this.client.chat.completions.create({
      model: this.prompts.getModelFromModelName(model),
      messages: historyMessages,
    });

    const botMsg = response.choices[0].message.content ?? '';

    Logger.log(response, 'Response');

    void this.saveUserMessage(convId, userMessage);
    void this.saveAssistantMessage(convId, botMsg, response.usage?.prompt_tokens ?? 0, response.usage?.completion_tokens ?? 0, model);

    return {
      conversationId: convId,
      message: botMsg,
      promptTokens: 0,
      completionTokens: 0,
    };
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
