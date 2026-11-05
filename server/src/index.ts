import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { tasksRouter } from './routes/tasks.router';
import { setupSummarizationWorker } from './workers/summarization.worker';

export const app = express();

app.use(cors());
app.use(express.json());

const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    service: 'digestible-server',
    timestamp: new Date().toISOString(),
  });
};

app.get('/', healthHandler);
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

app.use('/api/tasks', tasksRouter);

if (!process.env.VERCEL) {
  console.log('[Server] Starting BullMQ summarization worker background process...');
  const worker = setupSummarizationWorker();

  const server = app.listen(config.PORT, () => {
    console.log(`Digestible API Server listening on port ${config.PORT} [${config.NODE_ENV}]`);
    console.log(`Health check: http://localhost:${config.PORT}/health`);
    console.log(`Tasks API: http://localhost:${config.PORT}/api/tasks`);
  });

  process.on('SIGTERM', async () => {
    console.log('[Server] Gracefully shutting down...');
    await worker.close();
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  });
}

export default app;
