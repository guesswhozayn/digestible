import { Queue } from 'bullmq';
import { redisConnectionOptions } from '../config/redis';

export const AI_GENERATION_QUEUE_NAME = 'ai-generation-queue';

export interface SummarizationJobData {
  taskId: string;
  reelUrl: string;
  prompt?: string;
  userId?: string;
}

export const summarizationQueue = new Queue<SummarizationJobData>(AI_GENERATION_QUEUE_NAME, {
  connection: redisConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

/**
 * Enqueues a video summarization job into BullMQ
 */
export async function enqueueSummarizationJob(data: SummarizationJobData) {
  const job = await summarizationQueue.add('summarize-reel-job', data, {
    jobId: data.taskId,
  });
  return job;
}
