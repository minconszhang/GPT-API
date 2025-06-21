import { Controller, Get } from '@nestjs/common';
import { PromptService } from './llm.service';

@Controller('model-list')
export class LlmController {
  constructor(private prompts: PromptService) {}

  @Get()
  getAllModels() {
    return this.prompts.getModels();
  }
}
