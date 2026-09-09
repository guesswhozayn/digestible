# Digestible

Digestible is an AI-powered media digestion and content summarization platform. It transforms short-form video reels, audio streams, and web content into structured, actionable written summaries. The platform consists of a backend processing engine, a shared TypeScript contract package, an Expo-powered mobile app, and a responsive web client.

## Table of Contents

- Overview
- Architecture and Monorepo Structure
- Processing Pipeline
- Technology Stack
- Database Schema
- Environment Configuration
- Getting Started
- Monorepo Scripts
- API and Queue Architecture
- Mobile and Web Clients
- License

## Overview

Modern short-form video formats (Instagram Reels, YouTube Shorts, TikToks) contain valuable educational, technical, and informational insights that are difficult to search, index, or review quickly. Digestible extracts the underlying audio and video data, performs speech transcription and content analysis using advanced LLMs (Google Gemini and OpenRouter), and produces structured digests that can be read in seconds on mobile or web.

## Architecture and Monorepo Structure

Digestible is organized as an npm workspace monorepo divided into applications (`apps/`) and shared libraries (`packages/`):

```
digestible/
├── package.json               # Monorepo root configuration
├── package-lock.json
├── schema.sql                 # Supabase PostgreSQL schema and RLS policies
├── tsconfig.base.json         # Base TypeScript configuration
├── packages/
│   └── shared/                # Shared data contracts, types, and schemas
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts       # Package entry point
│           ├── types.ts       # Domain models, task status, and summary interfaces
│           └── schemas.ts     # Zod runtime validation schemas
└── apps/
    ├── server/                # Backend API, queue workers, and extractors
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts       # Express server initialization
    │       ├── config/        # Redis, Supabase, and environment configuration
    │       ├── routes/        # Task submission and status routes
    │       ├── queues/        # BullMQ queue definitions
    │       ├── workers/       # Background processors for transcription and summarization
    │       └── services/      # Audio, video, and AI providers (Gemini, OpenRouter)
    ├── mobile/                # React Native client powered by Expo
    │   ├── package.json
    │   ├── app.json
    │   ├── App.tsx
    │   └── src/               # Mobile screens, navigation, and state handlers
    └── web/                   # Vite and React desktop web client
        ├── package.json
        ├── vite.config.ts
        └── src/
            ├── App.tsx
            ├── index.css
            └── components/    # Web layout and submission components
```

## Processing Pipeline

```
[ Mobile / Web User ]
         |
         | 1. Submit reel URL and custom prompt
         v
+--------------------------------------------------------------+
|                    Express API (@digestible/server)          |
|  - Validates request payload using Zod (@digestible/shared)   |
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
- Workspace Manager: npm workspaces
- Language: TypeScript 5.7
- Validation: Zod 3.23

### Server Application (`apps/server`)
- Runtime: Node.js, Express 4
- Process Execution: ts-node-dev
- AI Providers: Google GenAI SDK (`@google/genai`), OpenRouter REST API
- Queuing and Caching: BullMQ 5, Redis (`ioredis` 5)
- Database Client: Supabase JS (`@supabase/supabase-js`)
- HTTP Client: Axios

### Mobile Application (`apps/mobile`)
- Framework: React Native 0.76, Expo 52
- Typography: Expo Google Fonts (Instrument Serif)
- Icons: Lucide React Native
- Storage: React Native Async Storage
- Vector Graphics: React Native SVG
- View Management: React Native Safe Area Context, React Native Screens

### Web Client (`apps/web`)
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

### Server Configuration (`apps/server/.env`)

| Variable | Description | Example / Default |
| --- | --- | --- |
| PORT | Port for Express server | 4000 |
| SUPABASE_URL | Supabase project URL | https://xyzcompany.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key with write permissions | eyJhbGciOi... |
| GEMINI_API_KEY | Google Gemini API Key | AIzaSy... |
| OPENROUTER_API_KEY | OpenRouter API Key for fallback LLM generation | sk-or-v1-... |
| REDIS_HOST | Redis host for BullMQ queues | 127.0.0.1 |
| REDIS_PORT | Redis port | 6379 |
| REDIS_PASSWORD | Redis authentication password (optional) | |

### Mobile Configuration (`apps/mobile/.env`)

| Variable | Description | Example / Default |
| --- | --- | --- |
| EXPO_PUBLIC_SUPABASE_URL | Supabase project URL accessible by mobile app | https://xyzcompany.supabase.co |
| EXPO_PUBLIC_SUPABASE_ANON_KEY | Supabase public anonymous API key | eyJhbGciOi... |
| EXPO_PUBLIC_API_URL | Server backend URL | http://10.0.2.2:4000/api |

### Web Client Configuration (`apps/web/.env`)

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

2. Install dependencies for all monorepo packages:
   ```bash
   npm install
   ```

3. Build the shared types package first:
   ```bash
   npm run build:shared
   ```

4. Populate environment variables in `apps/server/.env`, `apps/mobile/.env`, and `apps/web/.env`.

### Running Applications

Run server in development mode with hot reloading:
```bash
npm run dev:server
```

Run web frontend:
```bash
npm run dev:web
```

Run mobile app via Expo:
```bash
npm run dev:mobile
```

Run mobile app offline:
```bash
npm run --workspace=apps/mobile start
```

## Monorepo Scripts

The root `package.json` provides unified workspace commands:

- `npm run dev:server`: Starts Express server via `ts-node-dev`.
- `npm run dev:web`: Launches Vite development server for web.
- `npm run dev:mobile`: Launches Expo development server for mobile.
- `npm run build:shared`: Compiles `packages/shared` TypeScript definitions.
- `npm run build:server`: Compiles backend TypeScript to `dist/`.
- `npm run build:web`: Compiles production web bundle.
- `npm run check-types`: Runs type checking across all workspaces that provide a typecheck script.

## API and Queue Architecture

### REST Endpoints
- `POST /api/tasks`: Accepts `reel_url` and optional `prompt`. Validates inputs against `@digestible/shared` schema, inserts row into Supabase, and adds job to Redis BullMQ.
- `GET /api/tasks/:id`: Fetches the current processing status and summary data for a given task ID.
- `GET /api/tasks`: Fetches historical summaries with optional pagination and filtering.

### Queues and Workers
- `taskQueue`: BullMQ queue that coordinates heavy audio and video extraction.
- Workers download media buffers, pass audio chunks to Gemini models using structured JSON schemas, and write the final summary payload into the Supabase database.
- Real-time updates trigger notifications to active mobile and web subscribers.

## Mobile and Web Clients

- Mobile Client: Built for fast readability on the go with custom serif typography (`Instrument Serif`), swipe navigation, card decks, and offline caching via AsyncStorage.
- Web Client: Minimalist responsive desktop view optimized for content creators, researchers, and power users who submit URLs in bulk.

## License

This project is private and proprietary.
