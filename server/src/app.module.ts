import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ChatModule, LlmModule],
})
export class AppModule {}
