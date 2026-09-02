import { ReelSummaryResult } from '@digestible/shared';
import { config } from '../config/env';
import { VideoExtractorService } from './videoExtractor';

export class OpenRouterService {
  /**
   * Analyzes an Instagram Reel using OpenRouter commercial API endpoint.
   * Supports Google Gemini 2.5 Flash/Pro, Claude 3.5 Sonnet, GPT-4o, etc.
   */
  static async summarizeReel(reelUrl: string, customPrompt?: string): Promise<ReelSummaryResult> {
    const apiKey = config.OPENROUTER_API_KEY;
    const model = config.OPENROUTER_MODEL || 'google/gemini-2.5-flash';

    console.log(`[OpenRouterService] Starting commercial analysis via OpenRouter model: ${model}`);

    const { metadata: videoMeta, videoBuffer, audioData } = await VideoExtractorService.extractMediaStream(reelUrl);
    const promptInstruction = customPrompt
      ? `USER FOCUS INSTRUCTION: "${customPrompt}"\nMake answering this instruction the primary focus of "summary", "keyTakeaways", "actionableInsights", and "stepByStepInstructions".`
      : `GENERAL ANALYSIS: Provide a complete breakdown of what happens in this video.`;

    const audioSpecInfo = audioData?.formatInfo || '44.1kHz AAC Stereo / 128 kbps';

    const systemPrompt = `
You are an expert AI Multimodal Video and Audio Analyst powered by ${model} via OpenRouter.
WATCH the video frames, READ on-screen text overlays (OCR), and LISTEN to the spoken audio and acoustic background.

Reel URL: "${reelUrl}"
Video: ${videoMeta.durationSeconds}s, ${videoMeta.resolution}
Audio Specs: ${audioSpecInfo}

${promptInstruction}

Return ONLY a single valid JSON object with this schema (no markdown, no extra text):
{
  "title": "Descriptive title based on actual video content",
  "summary": "${customPrompt ? 'Direct answer to user prompt, then executive overview' : '2-sentence executive summary of actual video content'}",
  "keyTakeaways": ["Actual takeaway 1", "Actual takeaway 2", "Actual takeaway 3"],
  "viralHook": {
    "hookText": "Exact opening line or first visual hook from video",
    "hookEffectivenessScore": 90,
    "whyItWorks": "Psychological reason this hook captures attention"
  },
  "timestampedMoments": [
    { "timestamp": "00:02", "seconds": 2, "label": "Scene label", "summary": "What happens here", "visualDescription": "Exact visual description" },
    { "timestamp": "00:15", "seconds": 15, "label": "Scene label", "summary": "What happens here", "visualDescription": "Exact visual description" }
  ],
  "stepByStepInstructions": [
    { "stepNumber": 1, "title": "Step title from video", "detail": "Exact instruction shown in video", "timestamp": "00:05" }
  ],
  "onScreenTextHighlights": ["Exact OCR text 1", "Exact OCR text 2"],
  "keyQuotes": ["Exact spoken quote from video"],
  "audioAnalysis": {
    "fullTranscript": "Exact verbatim or near-verbatim transcription of spoken audio",
    "speakerTone": "Vocal tone e.g. Energetic & Authoritative / Calm & Informative",
    "backgroundMusic": "Description of background music, SFX, beat drop, or ambient sounds",
    "speechPace": "fast",
    "wordsPerMinute": 165,
    "clarityScore": 95,
    "audioFormatInfo": "${audioSpecInfo}"
  },
  "targetAudience": "Who this content targets",
  "category": "Content category",
  "estimatedReadTime": "30 seconds",
  "sentiment": "inspiring",
  "actionableInsights": ["Actionable step 1", "Actionable step 2"]
}`;

    const userContent: any[] = [{ type: 'text', text: systemPrompt }];

    if (videoBuffer && videoBuffer.length > 0 && videoBuffer.length <= 15 * 1024 * 1024) {
      // Pass video data URL if supported by multimodal provider
      const base64Data = videoBuffer.toString('base64');
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:video/mp4;base64,${base64Data}`
        }
      });
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://digestible.app',
          'X-Title': 'Digestible AI Platform',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: userContent,
            }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
      }

      const json = await response.json();
      const rawText = json.choices?.[0]?.message?.content || '';
      const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed: ReelSummaryResult = JSON.parse(cleanJson);
      parsed.videoMetadata = videoMeta;
      if (parsed.audioAnalysis && !parsed.audioAnalysis.audioFormatInfo) {
        parsed.audioAnalysis.audioFormatInfo = audioSpecInfo;
      }
      return parsed;
    } catch (error: any) {
      console.error('[OpenRouterService] API error:', error?.message || error);
      throw error;
    }
  }
}
