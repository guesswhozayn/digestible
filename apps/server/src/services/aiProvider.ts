import { ReelSummaryResult } from '@digestible/shared';
import { OpenRouterService } from './openrouter';

export class AIService {
  /**
   * Executes multimodal video summarization exclusively using OpenRouter API.
   */
  static async summarizeReel(reelUrl: string, customPrompt?: string): Promise<ReelSummaryResult> {
    console.log('[AIService] Processing video analysis via OpenRouter API...');
    return OpenRouterService.summarizeReel(reelUrl, customPrompt);
  }
}
