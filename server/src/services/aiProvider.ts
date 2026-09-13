import { ReelSummaryResult } from '../shared';
import { OpenRouterService } from './openrouter';

export class AIService {

  static async summarizeReel(reelUrl: string, customPrompt?: string): Promise<ReelSummaryResult> {
    console.log('[AIService] Processing video analysis via OpenRouter API...');
    return OpenRouterService.summarizeReel(reelUrl, customPrompt);
  }
}
