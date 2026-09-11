import { Worker, Job } from 'bullmq';
import { redisConnectionOptions } from '../config/redis';
import { AI_GENERATION_QUEUE_NAME, SummarizationJobData } from '../queues/summarization.queue';
import { AIService } from '../services/aiProvider';
import { supabaseAdmin } from '../config/supabase';

export function setupSummarizationWorker() {
  const worker = new Worker<SummarizationJobData>(
    AI_GENERATION_QUEUE_NAME,
    async (job: Job<SummarizationJobData>) => {
      const { taskId, reelUrl, prompt } = job.data;
      console.log(`[Worker] Starting job ${job.id} for Task ${taskId} (URL: ${reelUrl})`);

      try {
        // Step 1: Update Supabase status to 'processing'
        const { error: updateError } = await supabaseAdmin
          .from('summaries')
          .update({ status: 'processing' })
          .eq('id', taskId);

        if (updateError) {
          console.warn(`[Worker] Warning updating DB status to processing for ${taskId}:`, updateError.message);
        }

        // Step 2: Invoke AI Provider (OpenRouter or Gemini)
        console.log(`[Worker] Invoking AI Provider for Task ${taskId}...`);
        const summaryResult = await AIService.summarizeReel(reelUrl, prompt);

        // Step 3: Persist result directly to Supabase PostgreSQL table
        const { error: completeError } = await supabaseAdmin
          .from('summaries')
          .update({
            status: 'completed',
            summary_data: summaryResult,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskId);

        if (completeError) {
          console.error(`[Worker] Error persisting final summary for ${taskId}:`, completeError.message);
          throw new Error(`Failed to persist summary: ${completeError.message}`);
        }

        console.log(`[Worker] Successfully completed Task ${taskId}`);
        return summaryResult;
      } catch (err: any) {
        console.error(`[Worker] Job ${job.id} failed for Task ${taskId}:`, err.message);

        // Step 4: Mark task as failed in Supabase
        await supabaseAdmin
          .from('summaries')
          .update({
            status: 'failed',
            error_message: err.message || 'Unknown worker processing error',
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskId);

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
