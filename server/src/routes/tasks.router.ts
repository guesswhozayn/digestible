import { Router, Request, Response } from 'express';
import { createTaskSchema, taskIdParamSchema, TaskRecord } from '../shared';
import { supabaseAdmin } from '../config/supabase';
import { enqueueSummarizationJob } from '../queues/summarization.queue';
import { localTaskStore } from '../shared/store';

export const tasksRouter = Router();

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
    let taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      const { data: dbRecord } = await supabaseAdmin
        .from('summaries')
        .insert({
          reel_url: reelUrl,
          prompt: prompt || null,
          user_id: userId || null,
          status: 'pending',
        })
        .select('id, status, created_at')
        .single();

      if (dbRecord?.id) {
        taskId = dbRecord.id;
      }
    } catch (dbErr: any) {
      console.warn('[POST /api/tasks] DB fallback mode:', dbErr.message);
    }

    const initialRecord: TaskRecord = {
      id: taskId,
      reel_url: reelUrl,
      prompt: prompt || null,
      user_id: userId || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localTaskStore.set(taskId, initialRecord);

    try {
      await enqueueSummarizationJob({
        taskId,
        reelUrl,
        prompt,
        userId,
      });
    } catch (qErr: any) {
      console.warn('[POST /api/tasks] BullMQ Queue warning:', qErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Video summarization task created.',
      data: {
        taskId,
        status: 'pending',
        createdAt: initialRecord.created_at,
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

    if (localTaskStore.has(id)) {
      res.json({
        success: true,
        data: localTaskStore.get(id),
      });
      return;
    }

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

tasksRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const localRecords = Array.from(localTaskStore.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (localRecords.length > 0) {
      res.json({
        success: true,
        data: localRecords,
      });
      return;
    }

    const { data: records } = await supabaseAdmin
      .from('summaries')
      .select('id, reel_url, prompt, status, summary_data, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

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
