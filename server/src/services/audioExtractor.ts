import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const execFileAsync = promisify(execFile);
const YTDLP_PATH = path.join(__dirname, '..', '..', 'yt-dlp');

export interface ExtractedAudioData {
  audioBuffer?: Buffer;
  audioBase64?: string;
  directAudioUrl?: string;
  formatInfo: string;
  sampleRate: string;
  channels: string;
  estimatedBitrate: string;
}

export class AudioExtractorService {

  static async extractAudioStream(reelUrl: string): Promise<ExtractedAudioData> {
    console.log(`[AudioExtractorService] Extracting audio stream track for: ${reelUrl}`);

    let formatInfo = '44.1kHz Stereo (AAC) / 128 kbps';
    let sampleRate = '44.1 kHz';
    let channels = 'Stereo (2-channel)';
    let estimatedBitrate = '128 kbps';
    let directAudioUrl: string | undefined = undefined;
    let audioBase64: string | undefined = undefined;

    if (!fs.existsSync(YTDLP_PATH)) {
      console.warn('[AudioExtractorService] yt-dlp binary not found, using stream defaults.');
      return { formatInfo, sampleRate, channels, estimatedBitrate };
    }

    try {
      console.log('[AudioExtractorService] Fetching audio metadata via yt-dlp...');
      const { stdout: jsonOut } = await execFileAsync(
        YTDLP_PATH,
        ['-f', 'bestaudio/best', '--dump-json', '--no-warnings', reelUrl],
        { timeout: 8000 }
      );

      const meta = JSON.parse(jsonOut.trim());
      const audioFormat = meta.formats?.find((f: any) => f.acodec && f.acodec !== 'none') || meta;
      directAudioUrl = meta.url || audioFormat?.url;

      const sr = audioFormat?.asr ? `${(audioFormat.asr / 1000).toFixed(1)}kHz` : '44.1kHz';
      const abr = audioFormat?.abr ? `${Math.round(audioFormat.abr)} kbps` : '128 kbps';
      const acodec = (audioFormat?.acodec || meta.acodec || 'aac').toUpperCase();
      const ch = audioFormat?.audio_channels ? `${audioFormat.audio_channels}-channel` : 'Stereo (2-channel)';
      formatInfo = `${sr} ${acodec} (${abr})`;
      sampleRate = sr;
      channels = ch;
      estimatedBitrate = abr;
    } catch (directErr: any) {
      console.warn('[AudioExtractorService] Direct audio metadata note:', directErr.message?.slice(0, 100));
    }

    const tempAudioId = `audio_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const tmpAudioPath = path.join(os.tmpdir(), `${tempAudioId}.m4a`);

    try {
      console.log('[AudioExtractorService] Downloading standalone audio track for speech transcription...');
      await execFileAsync(
        YTDLP_PATH,
        ['-o', tmpAudioPath, '-f', 'bestaudio/best', '--max-filesize', '6m', '--no-warnings', reelUrl],
        { timeout: 10000 }
      );

      if (fs.existsSync(tmpAudioPath)) {
        const audioBuf = fs.readFileSync(tmpAudioPath);
        if (audioBuf.length > 0 && audioBuf.length <= 8 * 1024 * 1024) {
          audioBase64 = audioBuf.toString('base64');
          console.log(`[AudioExtractorService] Successfully extracted audio track payload (${(audioBuf.length / 1024).toFixed(1)} KB) for speech analysis.`);
        }
      }
    } catch (aErr: any) {
      console.warn('[AudioExtractorService] Audio track download note:', aErr.message?.slice(0, 80));
    } finally {
      if (fs.existsSync(tmpAudioPath)) {
        try { fs.unlinkSync(tmpAudioPath); } catch {}
      }
    }

    return {
      audioBase64,
      directAudioUrl,
      formatInfo,
      sampleRate,
      channels,
      estimatedBitrate,
    };
  }
}
