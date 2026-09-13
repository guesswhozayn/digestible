import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import ffmpegPath from 'ffmpeg-static';
import { VideoMetadata } from '../shared';
import { AudioExtractorService, ExtractedAudioData } from './audioExtractor';

const execFileAsync = promisify(execFile);
const YTDLP_PATH = path.join(__dirname, '..', '..', 'yt-dlp');

export interface ExtractedVideoData {
  metadata: VideoMetadata;
  directUrl?: string;
  keyframes?: string[]; 
  audioData?: ExtractedAudioData;
}

export class VideoExtractorService {

  static async extractMediaStream(reelUrl: string): Promise<ExtractedVideoData> {
    console.log(`[VideoExtractorService] Initiating frame-by-frame video & audio extraction for: ${reelUrl}`);

    const defaultMeta: VideoMetadata = {
      durationSeconds: 30,
      resolution: '1080x1920 (Vertical 9:16)',
      frameRate: 30,
      directStreamUrl: reelUrl,
    };

    const audioPromise = AudioExtractorService.extractAudioStream(reelUrl).catch(err => {
      console.warn('[VideoExtractorService] Audio extraction note:', err.message);
      return undefined;
    });

    let videoMetadata = defaultMeta;
    let directUrl = reelUrl;

    if (fs.existsSync(YTDLP_PATH)) {
      try {
        console.log('[VideoExtractorService] Fetching video metadata via yt-dlp...');
        const { stdout: jsonOut } = await execFileAsync(
          YTDLP_PATH,
          ['--dump-json', '--no-warnings', reelUrl],
          { timeout: 8000 }
        );

        const meta = JSON.parse(jsonOut.trim());
        directUrl = meta.url || meta.requested_formats?.[0]?.url || reelUrl;
        const durationSeconds = meta.duration ? Math.round(meta.duration) : 30;
        const width = meta.width || 1080;
        const height = meta.height || 1920;
        const resolution = `${width}x${height} (${height > width ? 'Vertical 9:16' : 'Horizontal'})`;
        const frameRate = meta.fps || 30;
        const title = meta.title || meta.fulltitle || '';
        const uploader = meta.uploader || meta.channel || meta.creator || '';
        const description = meta.description || meta.caption || '';

        videoMetadata = {
          durationSeconds,
          resolution,
          frameRate,
          directStreamUrl: directUrl,
          title,
          uploader,
          description,
        };
      } catch (ytErr: any) {
        console.warn('[VideoExtractorService] Metadata extraction note:', ytErr.message?.slice(0, 80));
      }
    }

    const keyframes: string[] = [];
    if (fs.existsSync(YTDLP_PATH) && ffmpegPath) {
      const tempId = `reel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const tmpVideoPath = path.join(os.tmpdir(), `${tempId}.mp4`);

      try {
        console.log('[VideoExtractorService] Extracting video sample for frame-by-frame vision analysis...');
        await execFileAsync(
          YTDLP_PATH,
          ['-o', tmpVideoPath, '-f', 'mp4/bestvideo+bestaudio/best', '--max-filesize', '12m', '--no-warnings', reelUrl],
          { timeout: 12000 }
        );

        if (fs.existsSync(tmpVideoPath)) {
          const framePattern = path.join(os.tmpdir(), `${tempId}_frame_%02d.jpg`);

          await execFileAsync(
            ffmpegPath,
            ['-i', tmpVideoPath, '-vf', 'fps=1/4', '-vframes', '5', '-q:v', '2', '-y', framePattern],
            { timeout: 10000 }
          );

          const files = fs.readdirSync(os.tmpdir()).filter(f => f.startsWith(`${tempId}_frame_`));
          for (const file of files) {
            const filePath = path.join(os.tmpdir(), file);
            const buf = fs.readFileSync(filePath);
            keyframes.push(buf.toString('base64'));
            try { fs.unlinkSync(filePath); } catch {}
          }
          console.log(`[VideoExtractorService] Successfully extracted ${keyframes.length} keyframe images for vision analysis.`);
        }
      } catch (frameErr: any) {
        console.warn('[VideoExtractorService] Keyframe extraction note:', frameErr.message?.slice(0, 80));
      } finally {
        if (fs.existsSync(tmpVideoPath)) {
          try { fs.unlinkSync(tmpVideoPath); } catch {}
        }
      }
    }

    const audioData = await audioPromise;
    return {
      metadata: videoMetadata,
      directUrl,
      keyframes,
      audioData,
    };
  }
}
