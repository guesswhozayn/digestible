import { execFile } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

const execFileAsync = promisify(execFile);
const YTDLP_PATH = path.join(__dirname, '..', '..', 'yt-dlp');

export interface ExtractedAudioData {
  audioBuffer?: Buffer;
  directAudioUrl?: string;
  formatInfo: string;
  sampleRate: string;
  channels: string;
  estimatedBitrate: string;
}

export class AudioExtractorService {
  /**
   * Attempts to extract the best standalone audio stream (AAC / M4A / MP3) from an Instagram Reel or video URL.
   */
  static async extractAudioStream(reelUrl: string): Promise<ExtractedAudioData> {
    console.log(`[AudioExtractorService] Extracting audio stream for: ${reelUrl}`);

    const defaultAudioData: ExtractedAudioData = {
      formatInfo: '44.1kHz Stereo (AAC) / 128 kbps',
      sampleRate: '44.1 kHz',
      channels: 'Stereo (2-channel)',
      estimatedBitrate: '128 kbps',
    };

    if (!fs.existsSync(YTDLP_PATH)) {
      console.warn('[AudioExtractorService] yt-dlp binary not found, using stream defaults.');
      return defaultAudioData;
    }

    const browsers = ['chrome', 'firefox', 'chromium'];
    for (const browser of browsers) {
      try {
        console.log(`[AudioExtractorService] Trying yt-dlp audio extraction with --cookies-from-browser=${browser}...`);
        
        // 1. Get direct bestaudio stream URL
        const { stdout } = await execFileAsync(
          YTDLP_PATH,
          ['-f', 'bestaudio/best', '--get-url', '--no-warnings', `--cookies-from-browser=${browser}`, reelUrl],
          { timeout: 12000 }
        );

        const directAudioUrl = stdout.trim().split('\n')[0];
        if (directAudioUrl && directAudioUrl.startsWith('http')) {
          console.log('[AudioExtractorService] Audio stream URL extracted successfully');

          // 2. Fetch audio JSON dump for bitrate & encoding info
          let formatInfo = '44.1kHz AAC Stereo / 128 kbps';
          let sampleRate = '44.1 kHz';
          let channels = 'Stereo (2-channel)';
          let estimatedBitrate = '128 kbps';

          try {
            const { stdout: jsonOut } = await execFileAsync(
              YTDLP_PATH,
              ['--dump-json', '--no-warnings', `--cookies-from-browser=${browser}`, reelUrl],
              { timeout: 12000 }
            );
            const meta = JSON.parse(jsonOut.trim());
            const audioFormat = meta.formats?.find((f: any) => f.acodec && f.acodec !== 'none') || meta;
            if (audioFormat) {
              const sr = audioFormat.asr ? `${(audioFormat.asr / 1000).toFixed(1)}kHz` : '44.1kHz';
              const abr = audioFormat.abr ? `${Math.round(audioFormat.abr)} kbps` : '128 kbps';
              const acodec = (audioFormat.acodec || 'aac').toUpperCase();
              formatInfo = `${sr} ${acodec} (${abr})`;
              sampleRate = sr;
              estimatedBitrate = abr;
            }
          } catch {}

          // 3. Attempt buffer download
          try {
            const response = await axios.get(directAudioUrl, {
              responseType: 'arraybuffer',
              timeout: 20000,
            });

            return {
              audioBuffer: Buffer.from(response.data),
              directAudioUrl,
              formatInfo,
              sampleRate,
              channels,
              estimatedBitrate,
            };
          } catch (dlErr: any) {
            console.warn('[AudioExtractorService] Audio buffer download failed, returning URL & metadata:', dlErr.message);
            return {
              directAudioUrl,
              formatInfo,
              sampleRate,
              channels,
              estimatedBitrate,
            };
          }
        }
      } catch (err: any) {
        console.log(`[AudioExtractorService] Audio extraction via ${browser} note: ${err.message?.slice(0, 80)}`);
      }
    }

    console.log('[AudioExtractorService] Direct standalone audio stream extraction fallback.');
    return defaultAudioData;
  }
}
