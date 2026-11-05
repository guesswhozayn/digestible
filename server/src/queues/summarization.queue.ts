import { Queue } from 'bullmq';
import { redisConnectionOptions } from '../config/redis';

export const AI_GENERATION_QUEUE_NAME = 'ai-generation-queue';

export interface SummarizationJobData {
  taskId: string;
  reelUrl: string;
  prompt?: string;
  userId?: string;
}

let summarizationQueueInstance: Queue<SummarizationJobData> | null = null;

function getSummarizationQueue(): Queue<SummarizationJobData> {
  if (!summarizationQueueInstance) {
    summarizationQueueInstance = new Queue<SummarizationJobData>(AI_GENERATION_QUEUE_NAME, {
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
    summarizationQueueInstance.on('error', (err) => {
      console.warn('[Queue] Redis connection warning:', err.message);
    });
  }
  return summarizationQueueInstance;
}

export async function enqueueSummarizationJob(data: SummarizationJobData) {
  const queue = getSummarizationQueue();
  const job = await queue.add('summarize-reel-job', data, {
    jobId: data.taskId,
  });
  return job;
}
