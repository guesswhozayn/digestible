import { ReelSummaryResult, VideoMetadata } from '../shared';
import { config } from '../config/env';
import { VideoExtractorService, ExtractedVideoData } from './videoExtractor';

export class GeminiService {
  /**
   * Summarizes video using Google Gemini 2.5 Flash native multimodal capabilities.
   * If videoBuffer is extracted (<15MB), passes inline MP4 directly so Gemini reads visual, OCR & audio simultaneously.
   * Otherwise passes extracted keyframe images or metadata.
   */
  static async summarizeReel(reelUrl: string, customPrompt?: string, preExtracted?: ExtractedVideoData): Promise<ReelSummaryResult> {
    const apiKey = config.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'demo-gemini-key') {
      throw new Error('GEMINI_API_KEY is not configured in server/.env');
    }

    const model = config.GEMINI_MODEL || 'gemini-2.5-flash';
    console.log(`[GeminiService] Starting multimodal analysis with model ${model} for: ${reelUrl}`);

    const extracted = preExtracted || (await VideoExtractorService.extractMediaStream(reelUrl));
    const { metadata: videoMeta, videoBuffer, keyframes } = extracted;

    const promptInstruction = customPrompt
      ? `USER FOCUS INSTRUCTION: "${customPrompt}"\nMake answering this instruction the primary focus of "summary", "keyTakeaways", and "stepByStepInstructions".`
      : `GENERAL ANALYSIS: Provide a complete visual and audio breakdown of what happens in this video.`;

    const systemPrompt = `
You are an expert Multimodal AI Video & Spoken Audio Analyst.
Examine this video carefully. Transcribe all spoken words and dialogue, analyze visual actions and on-screen text overlays (OCR), and identify core concepts.

Video Details:
- URL: "${reelUrl}"
- Title: "${videoMeta.title || 'Video Note'}"
- Creator: "${videoMeta.uploader || 'Creator'}"
- Duration: ${videoMeta.durationSeconds}s, ${videoMeta.resolution}
- Caption: "${videoMeta.description || ''}"

${promptInstruction}

Return ONLY a single valid JSON object strictly matching this schema (no markdown fences, no explanatory text):
{
  "title": "Descriptive title based on actual visual video content & spoken dialogue",
  "summary": "Clear executive summary covering the main content, context, and key takeaway",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "viralHook": {
    "hookText": "Exact opening spoken dialogue or on-screen hook shown in the first 3 seconds",
    "hookEffectivenessScore": 92,
    "whyItWorks": "Psychological or storytelling reason this hook captures attention"
  },
  "timestampedMoments": [
    { "timestamp": "00:01", "seconds": 1, "label": "Opening Hook", "summary": "Scene overview" }
  ],
  "stepByStepInstructions": [
    { "stepNumber": 1, "title": "Step title", "detail": "Detailed instruction or action shown" }
  ],
  "onScreenTextHighlights": ["Key on-screen text or bullet points"],
  "keyQuotes": ["Direct spoken quote from video"],
  "audioAnalysis": {
    "fullTranscript": "Exact verbatim speech-to-text transcription of spoken dialogue. Transcribe spoken words completely.",
    "speakerTone": "Vocal tone e.g. Energetic & Direct / Informative & Educational",
    "backgroundMusic": "Description of background track or audio atmosphere",
    "speechPace": "moderate",
    "wordsPerMinute": 140,
    "clarityScore": 92,
    "audioFormatInfo": "Stereo / Voice"
  },
  "targetAudience": "Target audience for this video",
  "category": "Video Insights",
  "estimatedReadTime": "${Math.max(15, Math.round(videoMeta.durationSeconds * 0.8))} seconds",
  "sentiment": "positive",
  "actionableInsights": ["Actionable takeaway from video"]
}`;

    const parts: any[] = [];

    // Path A: Inline video MP4 data (preferred for Gemini multimodal understanding)
    if (videoBuffer && videoBuffer.length > 0 && videoBuffer.length <= 15 * 1024 * 1024) {
      console.log(`[GeminiService] Attaching ${(videoBuffer.length / (1024 * 1024)).toFixed(1)} MB video stream to Gemini multimodal payload.`);
      parts.push({
        inlineData: {
          mimeType: 'video/mp4',
          data: videoBuffer.toString('base64'),
        },
      });
    } else if (keyframes && keyframes.length > 0) {
      // Path B: Keyframe images
      console.log(`[GeminiService] Attaching ${keyframes.length} JPEG keyframes to Gemini multimodal payload.`);
      for (const frameBase64 of keyframes.slice(0, 4)) {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: frameBase64,
          },
        });
      }
    }

    parts.push({ text: systemPrompt });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 3000,
          responseMimeType: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[GeminiService] API error ${response.status}:`, errBody.slice(0, 250));
      if (response.status === 400 && errBody.includes('API_KEY_INVALID')) {
        throw new Error('GEMINI_API_KEY is invalid. Please verify your Google AI Studio key in server/.env');
      }
      if (response.status === 429) {
        throw new Error('Gemini API quota exceeded or rate-limited. Please wait a moment before trying again.');
      }
      throw new Error(`Gemini API returned HTTP ${response.status}: ${errBody.slice(0, 100)}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini returned an empty response candidate.');
    }

    const cleanJson = candidateText.replace(/```(?:json)?\n?/gi, '').replace(/```\n?/g, '').trim();
    let parsedResult: ReelSummaryResult;

    try {
      parsedResult = JSON.parse(cleanJson);
    } catch {
      const match = cleanJson.match(/\{[\s\S]*\}/);
      if (match) {
        parsedResult = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse structured JSON from Gemini response.');
      }
    }

    parsedResult.videoMetadata = videoMeta;
    return parsedResult;
  }
}
