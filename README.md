# Digestible

Digestible is an AI-powered media digestion and content summarization platform. It transforms short-form video reels, audio streams, and web content into structured, actionable written summaries. The platform consists of a backend processing engine and a responsive web client.

## Table of Contents

- Overview
- Architecture and Workspace Structure
- Processing Pipeline
- Technology Stack
- Database Schema
- Environment Configuration
- Getting Started
- Workspace Scripts
- API and Queue Architecture
- Web Client
- License

## Overview

Modern short-form video formats (Instagram Reels, YouTube Shorts, TikToks) contain valuable educational, technical, and informational insights that are difficult to search, index, or review quickly. Digestible extracts the underlying audio and video data, performs speech transcription and content analysis using advanced LLMs (Google Gemini and OpenRouter), and produces structured digests that can be read in seconds on the web.

## Architecture and Workspace Structure

Digestible is organized as a clean two-folder workspace (`client/` and `server/`):

```
digestible/
├── package.json               # Root workspace configuration
├── package-lock.json
├── schema.sql                 # Supabase PostgreSQL schema and RLS policies
├── client/                    # Vite and React web client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── types/             # Client domain models
│       └── components/        # Web layout and summarizer components
└── server/                    # Backend API, queue workers, and extractors
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts           # Express server initialization
        ├── config/            # Redis, Supabase, and environment configuration
        ├── routes/            # Task submission and status routes
        ├── queues/            # BullMQ queue definitions
        ├── workers/           # Background processors for transcription and summarization
        ├── services/          # Audio, video, and AI providers (Gemini, OpenRouter)
        └── shared/            # Zod validation schemas and domain models
```

## Processing Pipeline

```
[ Web User ]
         |
         | 1. Submit reel URL and custom prompt
         v
+--------------------------------------------------------------+
|                    Express API (@digestible/server)          |
|  - Validates request payload using Zod schemas               |
|  - Inserts pending task record into Supabase                 |
|  - Enqueues background job into BullMQ                       |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                    Redis BullMQ Worker Queue                 |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                     Async Worker Pipeline                    |
|  1. Media Download: Video extractor fetches raw video stream |
|  2. Audio Extraction: FFmpeg isolates high-clarity audio      |
|  3. AI Analysis: Google Gemini / OpenRouter models generate   |
|     key takeaways, action items, and topic tags              |
|  4. Database Update: Supabase record marked as 'completed'   |
|     with structured JSONB summary payload                    |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                     Supabase PostgreSQL                      |
|  - Real-time client updates via Supabase subscriptions       |
+--------------------------------------------------------------+
```

## Technology Stack

### Monorepo and Core
- Workspace Manager: npm workspaces (`client`, `server`)
- Language: TypeScript 5.7
- Validation: Zod 3.23

### Server Application (`server/`)
- Runtime: Node.js, Express 4
- Process Execution: ts-node-dev
- AI Providers: OpenRouter REST API (Claude 3.5, Gemini 2.5 Flash, Auto)
- Queuing and Caching: BullMQ 5, Redis (`ioredis` 5)
- Database Client: Supabase JS (`@supabase/supabase-js`)
- HTTP Client: Axios

### Client Application (`client/`)
- Framework: React 18, Vite 6
- Icons: Lucide React
- Styling: Custom responsive CSS design system

### Database
- PostgreSQL managed via Supabase with Row Level Security (RLS)

## Database Schema

The database is defined in `schema.sql` and includes the following primary entities:

### Status Enum
```sql
CREATE TYPE summary_status AS ENUM ('pending', 'processing', 'completed', 'failed');
```

### Summaries Table (`public.summaries`)
- `id` (UUID, Primary Key, auto-generated)
- `user_id` (UUID, nullable reference to `auth.users`)
- `reel_url` (TEXT, required source video URL)
- `prompt` (TEXT, optional custom summarization prompt)
- `status` (summary_status enum, defaults to 'pending')
- `summary_data` (JSONB, structured output including title, key points, transcript, and tags)
- `error_message` (TEXT, captures processing failures)
- `created_at` (TIMESTAMPTZ, auto-assigned)
- `updated_at` (TIMESTAMPTZ, maintained by trigger function)

### Security Policies
- Public Read: Allows access to public summaries or user-owned summaries.
- Unauthenticated / Authenticated Submissions: Allows insertion of new processing tasks.
- Service Role Access: Backend workers utilize the service role key to update task progress and output data.

## Environment Configuration

### Server Configuration (`server/.env`)

| Variable | Description | Example / Default |
| --- | --- | --- |
| PORT | Port for Express server | 4000 |
| SUPABASE_URL | Supabase project URL | https://xyzcompany.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key with write permissions | eyJhbGciOi... |
| OPENROUTER_API_KEY | OpenRouter API Key for AI summarization | sk-or-v1-... |
| OPENROUTER_MODEL | OpenRouter model identifier | openrouter/auto |
| REDIS_HOST | Redis host for BullMQ queues | 127.0.0.1 |
| REDIS_PORT | Redis port | 6379 |
| REDIS_PASSWORD | Redis authentication password (optional) | |

### Client Configuration (`client/.env`)

| Variable | Description | Example / Default |
| --- | --- | --- |
| VITE_SUPABASE_URL | Supabase project URL | https://xyzcompany.supabase.co |
| VITE_SUPABASE_ANON_KEY | Supabase public anonymous API key | eyJhbGciOi... |
| VITE_API_URL | Server backend URL | http://localhost:4000/api |

## Getting Started

### Prerequisites
- Node.js version 18 or higher
- npm version 9 or higher
- Redis server installed and running locally on port 6379
- Supabase project with `schema.sql` applied

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <repository-url>
   cd digestible
   ```

2. Install dependencies for workspaces:
   ```bash
   npm install
   ```

3. Populate environment variables in `server/.env` and `client/.env`.

### Running Applications

Run server in development mode with hot reloading:
```bash
npm run dev:server
```

Run client frontend:
```bash
npm run dev:client
```

## Workspace Scripts

The root `package.json` provides unified workspace commands:

- `npm run dev:server`: Starts Express server via `ts-node-dev`.
- `npm run dev:client`: Launches Vite development server for client.
- `npm run build:server`: Compiles backend TypeScript to `dist/`.
- `npm run build:client`: Compiles production client bundle.
- `npm run check-types`: Runs type checking across all workspaces that provide a typecheck script.

## API and Queue Architecture

### REST Endpoints
- `POST /api/tasks`: Accepts `reel_url` and optional `prompt`. Validates inputs against schemas, inserts row into Supabase, and adds job to Redis BullMQ.
- `GET /api/tasks/:id`: Fetches the current processing status and summary data for a given task ID.
- `GET /api/tasks`: Fetches historical summaries with optional pagination and filtering.

### Queues and Workers
- `taskQueue`: BullMQ queue that coordinates heavy audio and video extraction.
- Workers download media buffers, pass audio chunks to Gemini models using structured JSON schemas, and write the final summary payload into the Supabase database.
- Real-time updates trigger notifications to active web subscribers.

## Web Client

- Web Client: Modern, responsive web platform featuring an interactive landing page, real-time workflow diagrams, interactive component previews, and a video summarizer dashboard optimized for desktop, tablet, and mobile browsers.

## License

This project is private and proprietary.
