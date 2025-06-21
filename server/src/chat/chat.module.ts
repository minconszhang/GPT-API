import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports:    [LlmModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
