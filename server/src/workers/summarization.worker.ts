import { Worker, Job } from 'bullmq';
import { redisConnectionOptions } from '../config/redis';
import { AI_GENERATION_QUEUE_NAME, SummarizationJobData } from '../queues/summarization.queue';
import { AIService } from '../services/aiProvider';
import { supabaseAdmin } from '../config/supabase';
import { localTaskStore } from '../shared/store';

export function setupSummarizationWorker() {
  const worker = new Worker<SummarizationJobData>(
    AI_GENERATION_QUEUE_NAME,
    async (job: Job<SummarizationJobData>) => {
      const { taskId, reelUrl, prompt } = job.data;
      console.log(`[Worker] Starting job ${job.id} for Task ${taskId} (URL: ${reelUrl})`);

      const existing = localTaskStore.get(taskId);
      localTaskStore.set(taskId, {
        id: taskId,
        reel_url: reelUrl,
        prompt,
        status: 'processing',
        created_at: existing?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      try {

        try {
          await supabaseAdmin
            .from('summaries')
            .update({ status: 'processing' })
            .eq('id', taskId);
        } catch {}

        console.log(`[Worker] Invoking AI Provider for Task ${taskId}...`);
        const summaryResult = await AIService.summarizeReel(reelUrl, prompt);

        localTaskStore.set(taskId, {
          id: taskId,
          reel_url: reelUrl,
          prompt,
          status: 'completed',
          summary_data: summaryResult,
          created_at: existing?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        try {
          await supabaseAdmin
            .from('summaries')
            .update({
              status: 'completed',
              summary_data: summaryResult,
              updated_at: new Date().toISOString(),
            })
            .eq('id', taskId);
        } catch {}

        console.log(`[Worker] Successfully completed Task ${taskId} for ${reelUrl}`);
        return summaryResult;
      } catch (err: any) {
        console.error(`[Worker] Job ${job.id} failed for Task ${taskId}:`, err.message);

        localTaskStore.set(taskId, {
          id: taskId,
          reel_url: reelUrl,
          prompt,
          status: 'failed',
          error_message: err.message || 'Worker processing error',
          created_at: existing?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        try {
          await supabaseAdmin
            .from('summaries')
            .update({
              status: 'failed',
              error_message: err.message || 'Worker processing error',
              updated_at: new Date().toISOString(),
            })
            .eq('id', taskId);
        } catch {}

        throw err;
      }
    },
    {
      connection: redisConnectionOptions,
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker Event] Job ${job.id} completed successfully.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker Event] Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
