import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptService {
  private static readonly PROMPTS: Record<number, string> = {
    1: `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. Personality: v2`,
    2: `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. Personality: v2`,
    3: `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. Personality: v2`,
    4: `You are ChatGPT, a large language model trained by OpenAI.
        Knowledge cutoff: 2024-06
        Personality: v2
        Engage warmly yet honestly with the user. Be direct; avoid ungrounded or sycophantic flattery. Maintain professionalism and grounded honesty that best represents OpenAI and its values.
      `,
    5: `你是我的雅思写作批改老师，收到我的作文后，请严格参照雅思官方评分细则，为我的作文按以下四个维度（0.0–9.0，允许半分）评分，并给出详细反馈：

        1. Task Achievement (任务完成)  
          - Band 9 要点：完整回应所有部分；立场鲜明；论证无懈可击。  
          - Band 7 要点：回应所有要求；立场贯穿；支持力度适中。  
          - Band 5 要点：只完成部分要求；观点不够明确或支撑不足。  

        2. Coherence and Cohesion (连贯与衔接)  
          - Band 9 要点：结构清晰；段落衔接自然而流畅；手段多样。  
          - Band 7 要点：组织合理；衔接较好；词汇使用略显生硬。  
          - Band 5 要点：缺乏清晰结构；衔接匮乏；影响理解。  

        3. Lexical Resource (词汇资源)  
          - Band 9 要点：词汇量极其丰富；几乎无拼写或搭配错误。  
          - Band 7 要点：词汇多样；表达准确；偶有重复或平凡。  
          - Band 5 要点：词汇量有限；大量拼写/用词错误。  

        4. Grammatical Range and Accuracy (语法范围与准确性)  
          - Band 9 要点：句式多样精准；几乎无语法失误；复杂结构自如。  
          - Band 7 要点：能用复合句；错误少；简单句准确。  
          - Band 5 要点：语法错误频繁；结构简单且易歧义。  

        **输出结构：**  
        - ## 总体评分  
          - **总分**：Band X.X  
        - ## 分项打分与理由  
          1. **Task Achievement：X.X**  
            - 理由：……（对照 Band 要点）  
          2. **Coherence and Cohesion：X.X**  
            - 理由：……  
          3. **Lexical Resource：X.X**  
            - 理由：……  
          4. **Grammatical Range and Accuracy：X.X**  
            - 理由：……  
        - ## 改进建议  
          - （条目化，至少三点）  
        - ## 纠错清单  
          | 序号 | 原文片段         | 错误类型 | 建议修改     | 备注（错误/建议） |  
          |------|------------------|----------|--------------|------------------|  
          | 1    | from XXX         | 语法     | 改为 YYY     | 错误             |  
          | 2    | from AAA         | 用词     | 改为 BBB     | 建议             |  
          ……
      `,
    6: `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture. Personality: v2`,
  };

  private static readonly MODELS: Record<string, string> = {
    '1': 'gpt-4.1-mini',
    '2': 'gpt-4.1-nano',
    '3': 'gpt-4.1',
    '4': 'o4-mini',
    '5': 'gpt-4.1-mini',
    '6': 'qwen/qwen3-30b-a3b',
  };

  private static readonly MODELS_NAME: Record<string, string> = {
    '1': '4.1 基础版',
    '2': '4.1 低级版',
    '3': '4.1 完全版',
    '4': 'O4 思考版',
    '5': 'IELTS 写作老师',
    '6': '千问免费版',
  };

  private static readonly PRICES: Record<
    string,
    { prompt_tokens: number; completion_tokens: number }
  > = {
      'gpt-4.1-mini': { prompt_tokens: 0.4, completion_tokens: 1.6 },
      'gpt-4.1-nano': { prompt_tokens: 0.1, completion_tokens: 0.4 },
      'gpt-4.1': { prompt_tokens: 2, completion_tokens: 8 },
      'o4-mini': { prompt_tokens: 1.1, completion_tokens: 4.4 },
      'qwen/qwen3-30b-a3b': { prompt_tokens: 0, completion_tokens: 0 },
    };

  getPromptFromModelName(modelName: string): string {
    const index = this.getIndexFromModelName(modelName);
    return PromptService.PROMPTS[index] || '';
  }

  getModelFromModelName(modelName: string): string {
    return PromptService.MODELS[this.getIndexFromModelName(modelName)] || '';
  }

  getPrice(model: string) {
    return PromptService.PRICES[model] || null;
  }

  getIndexFromModelName(modelName: string): string {
    return Object.keys(PromptService.MODELS_NAME).find(
      (key) => PromptService.MODELS_NAME[key] === modelName,
    ) ?? '1';
  }

  getModels() {
    return Object.values(PromptService.MODELS_NAME);
  }
}
