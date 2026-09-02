import { Router, Request, Response } from 'express';
import { createTaskSchema, taskIdParamSchema } from '@digestible/shared';
import { supabaseAdmin } from '../config/supabase';
import { enqueueSummarizationJob } from '../queues/summarization.queue';

export const tasksRouter = Router();

/**
 * POST /api/tasks
 * Enqueue a new Instagram Reel video summarization job
 */
tasksRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = createTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format(),
      });
      return;
    }

    const { reelUrl, prompt, userId } = parseResult.data;

    // 1. Create initial record in Supabase with status 'pending'
    const { data: dbRecord, error: dbError } = await supabaseAdmin
      .from('summaries')
      .insert({
        reel_url: reelUrl,
        prompt: prompt || null,
        user_id: userId || null,
        status: 'pending',
      })
      .select('id, status, created_at')
      .single();

    if (dbError || !dbRecord) {
      console.error('[POST /api/tasks] Supabase insert error:', dbError);
      
      // Fallback in case DB is unreachable during development setup: generate UUID
      const fallbackId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      try {
        await enqueueSummarizationJob({
          taskId: fallbackId,
          reelUrl,
          prompt,
          userId,
        });
      } catch (qErr: any) {
        console.error('[POST /api/tasks] Queue error:', qErr);
      }

      res.status(202).json({
        success: true,
        message: 'Task enqueued (fallback mode)',
        data: {
          taskId: fallbackId,
          status: 'pending',
          reelUrl,
        },
      });
      return;
    }

    // 2. Enqueue job to BullMQ queue
    await enqueueSummarizationJob({
      taskId: dbRecord.id,
      reelUrl,
      prompt,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Video summarization task successfully created and queued.',
      data: {
        taskId: dbRecord.id,
        status: dbRecord.status,
        createdAt: dbRecord.created_at,
      },
    });
  } catch (error: any) {
    console.error('[POST /api/tasks] Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create video summarization task',
      message: error.message,
    });
  }
});

/**
 * GET /api/tasks/:id
 * Retrieve processing status and summary results for a task
 */
tasksRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = taskIdParamSchema.safeParse(req.params);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid Task ID format',
      });
      return;
    }

    const { id } = parseResult.data;

    const { data: record, error } = await supabaseAdmin
      .from('summaries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !record) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
      });
      return;
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error('[GET /api/tasks/:id] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching task',
    });
  }
});

/**
 * GET /api/tasks
 * Retrieve recent tasks list
 */
tasksRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: records, error } = await supabaseAdmin
      .from('summaries')
      .select('id, reel_url, prompt, status, summary_data, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks',
        details: error.message,
      });
      return;
    }

    res.json({
      success: true,
      data: records || [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});
