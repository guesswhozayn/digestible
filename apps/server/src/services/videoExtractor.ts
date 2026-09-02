import { execFile } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import { VideoMetadata } from '@digestible/shared';

import { AudioExtractorService, ExtractedAudioData } from './audioExtractor';

const execFileAsync = promisify(execFile);
const YTDLP_PATH = path.join(__dirname, '..', '..', 'yt-dlp');

export interface ExtractedVideoData {
  metadata: VideoMetadata;
  videoBuffer?: Buffer;
  directUrl?: string;
  audioData?: ExtractedAudioData;
}

export class VideoExtractorService {
  /**
   * Attempts to extract a direct MP4 URL and binary buffer from an Instagram Reel
   * using yt-dlp with browser cookies for authentication.
   *
   * Priority order:
   * 1. yt-dlp with browser cookies → real direct .mp4 URL → buffer download
   * 2. Direct MP4 URL passthrough (if reelUrl is already a .mp4 link)
   * 3. Graceful fallback: return metadata only, Gemini will reason from URL + text prompt
   */
  static async extractMediaStream(reelUrl: string): Promise<ExtractedVideoData> {
    console.log(`[VideoExtractorService] Initiating video & audio extraction for: ${reelUrl}`);

    const defaultMeta: VideoMetadata = {
      durationSeconds: 30,
      resolution: '1080x1920 (Vertical 9:16)',
      frameRate: 30,
      directStreamUrl: reelUrl,
    };

    // Extract audio stream asynchronously in parallel
    const audioPromise = AudioExtractorService.extractAudioStream(reelUrl).catch(err => {
      console.warn('[VideoExtractorService] Audio extraction note:', err.message);
      return undefined;
    });

    // 1. If already a direct .mp4 link, download buffer directly
    if (reelUrl.includes('.mp4')) {
      try {
        console.log('[VideoExtractorService] Direct MP4 URL detected, downloading...');
        const response = await axios.get(reelUrl, {
          responseType: 'arraybuffer',
          timeout: 20000,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
        });
        const audioData = await audioPromise;
        return {
          metadata: defaultMeta,
          videoBuffer: Buffer.from(response.data),
          directUrl: reelUrl,
          audioData,
        };
      } catch (e: any) {
        console.warn('[VideoExtractorService] Direct MP4 download failed:', e.message);
      }
    }

    // 2. yt-dlp: try --cookies-from-browser for authenticated extraction
    if (fs.existsSync(YTDLP_PATH)) {
      const browsers = ['chrome', 'firefox', 'chromium'];
      for (const browser of browsers) {
        try {
          console.log(`[VideoExtractorService] Trying yt-dlp with --cookies-from-browser=${browser}...`);
          const { stdout } = await execFileAsync(
            YTDLP_PATH,
            ['--get-url', '--no-warnings', `--cookies-from-browser=${browser}`, reelUrl],
            { timeout: 12000 }
          );
          const directUrl = stdout.trim().split('\n')[0];
          if (directUrl && directUrl.startsWith('http')) {
            console.log('[VideoExtractorService] yt-dlp extracted URL via', browser);

            // Parse duration from yt-dlp JSON metadata
            let durationSeconds = 30;
            try {
              const { stdout: jsonOut } = await execFileAsync(
                YTDLP_PATH,
                ['--dump-json', '--no-warnings', `--cookies-from-browser=${browser}`, reelUrl],
                { timeout: 12000 }
              );
              const meta = JSON.parse(jsonOut.trim());
              durationSeconds = meta.duration || 30;
            } catch {}

            const audioData = await audioPromise;

            // Download binary buffer
            try {
              const bufferRes = await axios.get(directUrl, {
                responseType: 'arraybuffer',
                timeout: 30000,
              });
              return {
                metadata: { durationSeconds, resolution: '1080x1920 (Vertical 9:16)', frameRate: 30, directStreamUrl: directUrl },
                videoBuffer: Buffer.from(bufferRes.data),
                directUrl,
                audioData,
              };
            } catch (downloadErr: any) {
              console.warn('[VideoExtractorService] Buffer download failed, returning URL only:', downloadErr.message);
              return {
                metadata: { durationSeconds, resolution: '1080x1920 (Vertical 9:16)', frameRate: 30, directStreamUrl: directUrl },
                directUrl,
                audioData,
              };
            }
          }
        } catch (ytErr: any) {
          console.log(`[VideoExtractorService] yt-dlp ${browser} failed: ${ytErr.message?.slice(0, 80)}`);
        }
      }
    }

    const audioData = await audioPromise;

    // 3. Graceful fallback — Gemini will use the public URL + text prompt for reasoning
    console.log('[VideoExtractorService] All extraction methods failed — Gemini will use URL-based reasoning.');
    return { metadata: defaultMeta, audioData };
  }
}
