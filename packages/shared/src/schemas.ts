import { z } from 'zod';

export const createTaskSchema = z.object({
  reelUrl: z.string().min(1, 'Reel URL or Instagram content prompt is required'),
  prompt: z.string().optional(),
  userId: z.string().uuid('Invalid user ID format').optional(),
});

export const taskIdParamSchema = z.object({
  id: z.string().uuid('Invalid task ID format'),
});

export const timestampedMomentSchema = z.object({
  timestamp: z.string(),
  seconds: z.number(),
  label: z.string(),
  summary: z.string(),
  visualDescription: z.string().optional(),
});

export const stepInstructionSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  detail: z.string(),
  timestamp: z.string().optional(),
});

export const videoMetadataSchema = z.object({
  durationSeconds: z.number(),
  resolution: z.string(),
  frameRate: z.number(),
  directStreamUrl: z.string().optional(),
});

export const reelSummarySchema = z.object({
  title: z.string(),
  summary: z.string(),
  keyTakeaways: z.array(z.string()),
  viralHook: z.object({
    hookText: z.string(),
    hookEffectivenessScore: z.number().min(1).max(100),
    whyItWorks: z.string(),
  }),
  keyQuotes: z.array(z.string()),
  timestampedMoments: z.array(timestampedMomentSchema),
  stepByStepInstructions: z.array(stepInstructionSchema).optional(),
  onScreenTextHighlights: z.array(z.string()),
  targetAudience: z.string(),
  category: z.string(),
  estimatedReadTime: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'inspiring', 'informational', 'urgent']),
  actionableInsights: z.array(z.string()),
  videoMetadata: videoMetadataSchema.optional(),
});
