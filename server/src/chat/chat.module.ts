import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LlmModule } from '../llm/llm.module';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [LlmModule, DbModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
