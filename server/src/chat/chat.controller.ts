import { Query, Controller, Get, Res } from '@nestjs/common';
import { ChatDto } from './chat.dto';
import { ChatService } from './chat.service';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Stream chat response
  @Get('stream')
  async chatStream(@Res() res: Response, @Query('model') model: string, @Query('userMessage') userMessage: string, @Query('conversationId') conversationId?: string) {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Ensure the response is flushed immediately
    res.flushHeaders?.();

    await this.chatService.processChatStream(res, model, userMessage, conversationId);
  }
}
