import { GoogleGenAI } from '@google/genai';
import { ReelSummaryResult } from '@digestible/shared';
import { config } from '../config/env';
import { VideoExtractorService } from './videoExtractor';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

// Max size for inline base64 data — Gemini supports up to ~20MB inline
const MAX_INLINE_BYTES = 18 * 1024 * 1024;

export class GeminiService {
  /**
   * Analyzes an Instagram Reel by:
   * 1. Attempting to download the MP4 buffer and passing it as inlineData to Gemini 2.5 Flash
   * 2. For large files (>18MB), uploading via the Gemini Files API
   * 3. Falling back to URL + text-only multimodal reasoning if video is not extractable
   */
  static async summarizeReel(reelUrl: string, customPrompt?: string): Promise<ReelSummaryResult> {
    console.log(`[GeminiService] Starting multimodal analysis for: ${reelUrl}`);

    const { metadata: videoMeta, videoBuffer, directUrl } = await VideoExtractorService.extractMediaStream(reelUrl);
    const promptInstruction = customPrompt
      ? `USER FOCUS INSTRUCTION: "${customPrompt}"\nMake answering this instruction the primary focus of "summary", "keyTakeaways", "actionableInsights", and "stepByStepInstructions".`
      : `GENERAL ANALYSIS: Provide a complete breakdown of what happens in this video.`;

    const systemPrompt = `
You are an expert AI Multimodal Video Analyst powered by Gemini 2.5 Flash.
WATCH the video frame-by-frame, READ every on-screen text overlay (OCR), and LISTEN to the spoken audio.

Reel URL: "${reelUrl}"
Video: ${videoMeta.durationSeconds}s, ${videoMeta.resolution}

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
  "targetAudience": "Who this content targets",
  "category": "Content category",
  "estimatedReadTime": "30 seconds",
  "sentiment": "inspiring",
  "actionableInsights": ["Actionable step 1", "Actionable step 2"]
}`;

    try {
      let contentsPayload: any;

      if (videoBuffer && videoBuffer.length > 0) {
        if (videoBuffer.length <= MAX_INLINE_BYTES) {
          // --- Path A: Inline base64 for small/medium videos (<18MB)
          console.log(`[GeminiService] Sending ${(videoBuffer.length / 1024 / 1024).toFixed(1)}MB video as inlineData to Gemini...`);
          contentsPayload = [
            { inlineData: { mimeType: 'video/mp4', data: videoBuffer.toString('base64') } },
            { text: systemPrompt },
          ];
        } else {
          // --- Path B: Files API upload for large videos (>18MB)
          console.log(`[GeminiService] Video too large for inline (${(videoBuffer.length / 1024 / 1024).toFixed(1)}MB), uploading via Files API...`);
          const tmpPath = path.join(os.tmpdir(), `reel_${Date.now()}.mp4`);
          fs.writeFileSync(tmpPath, videoBuffer);
          try {
            const uploadedFile = await ai.files.upload({ file: tmpPath, config: { mimeType: 'video/mp4' } });
            console.log('[GeminiService] File uploaded, URI:', uploadedFile.uri);
            contentsPayload = [
              { fileData: { mimeType: 'video/mp4', fileUri: uploadedFile.uri } },
              { text: systemPrompt },
            ];
          } finally {
            if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
          }
        }
      } else {
        // --- Path C: No buffer — Gemini reasons from URL string + metadata
        console.log('[GeminiService] No video buffer available — using URL-based text reasoning...');
        contentsPayload = systemPrompt;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contentsPayload,
        config: { responseMimeType: 'application/json', temperature: 0.2 },
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed: ReelSummaryResult = JSON.parse(cleanJson);
      parsed.videoMetadata = videoMeta;
      return parsed;

    } catch (error: any) {
      console.error('[GeminiService] Gemini API error:', error?.message || error);

      // Surface the real error so it's visible in logs
      const isAuthError = error?.message?.includes('API key') || error?.message?.includes('INVALID_ARGUMENT');
      const isQuotaError = error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED');

      if (isAuthError) {
        throw new Error(
          'GEMINI_API_KEY is invalid. Please set a valid Google AI Studio key (AIzaSy...) in apps/server/.env'
        );
      }
      if (isQuotaError) {
        throw new Error('Gemini API quota exceeded. Please check your Google AI Studio billing.');
      }

      throw error;
    }
  }
}
