import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { tasksRouter } from './routes/tasks.router';
import { setupSummarizationWorker } from './workers/summarization.worker';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'digestible-server',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/tasks', tasksRouter);

// Initialize BullMQ Worker
console.log('[Server] Starting BullMQ summarization worker background process...');
const worker = setupSummarizationWorker();

// Start HTTP Server
const server = app.listen(config.PORT, () => {
  console.log(`🚀 Digestible API Server listening on port ${config.PORT} [${config.NODE_ENV}]`);
  console.log(`📌 Health check: http://localhost:${config.PORT}/health`);
  console.log(`📌 Tasks API: http://localhost:${config.PORT}/api/tasks`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('[Server] Gracefully shutting down...');
  await worker.close();
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
});
