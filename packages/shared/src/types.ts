export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface TimestampedMoment {
  timestamp: string; // e.g. "00:03"
  seconds: number;   // e.g. 3
  label: string;     // e.g. "The Viral Hook"
  summary: string;   // e.g. "Creator demonstrates instant ingredient swap"
  visualDescription?: string; // e.g. "Fast cuts of fresh basil and garlic"
}

export interface StepInstruction {
  stepNumber: number;
  title: string;
  detail: string;
  timestamp?: string;
}

export interface VideoMetadata {
  durationSeconds: number;
  resolution: string;
  frameRate: number;
  directStreamUrl?: string;
}

export interface ReelSummaryResult {
  title: string;
  summary: string;
  keyTakeaways: string[];
  viralHook: {
    hookText: string;
    hookEffectivenessScore: number; // 1-100
    whyItWorks: string;
  };
  keyQuotes: string[];
  timestampedMoments: TimestampedMoment[];
  stepByStepInstructions?: StepInstruction[];
  onScreenTextHighlights: string[];
  targetAudience: string;
  category: string;
  estimatedReadTime: string;
  sentiment: 'positive' | 'neutral' | 'inspiring' | 'informational' | 'urgent';
  actionableInsights: string[];
  videoMetadata?: VideoMetadata;
}

export interface CreateTaskPayload {
  reelUrl: string;
  prompt?: string;
  userId?: string;
}

export interface TaskRecord {
  id: string;
  user_id?: string | null;
  reel_url: string;
  prompt?: string | null;
  status: TaskStatus;
  summary_data?: ReelSummaryResult | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface EnqueueTaskResponse {
  taskId: string;
  status: TaskStatus;
  message: string;
}
