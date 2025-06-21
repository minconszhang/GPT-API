import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { PromptService } from './llm.service';

@Module({
  controllers: [LlmController],
  providers: [PromptService],
  exports: [PromptService],
})
export class LlmModule {}
