import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChatDto } from './chat.dto';
import { ChatService } from './chat.service';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Stream chat response
  @Post('stream')
  async chatStream(@Body() body: ChatDto, @Res() res: Response) {
    const { model, userMessage, conversationId } = body;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Ensure the response is flushed immediately
    res.flushHeaders?.();

    await this.chatService.processChatStream(res, model, userMessage, conversationId);
  }
}
