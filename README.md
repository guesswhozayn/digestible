# Digestible

> Turn 60-second video reels into 15-second actionable knowledge.

Digestible is an AI-powered media digestion and content summarization platform. It transforms short-form video reels (Instagram Reels, YouTube Shorts, and TikToks) and audio streams into clean, structured, and actionable written digests.

The platform is organized as a clean two-package workspace:
- **`client/`**: Modern, responsive React 18 & Vite web application featuring an interactive landing page and a full-featured reel summarizer dashboard.
- **`server/`**: Scalable Node.js & Express 4 backend with background BullMQ queue workers, FFmpeg/yt-dlp media extraction, Supabase integration, and OpenRouter AI summarization.

---

## Table of Contents

- [Overview](#overview)
- [Workspace Architecture](#workspace-architecture)
- [Processing Pipeline](#processing-pipeline)
- [Technology Stack](#technology-stack)
- [Prerequisites & System Dependencies](#prerequisites--system-dependencies)
- [Getting Started](#getting-started)
- [Workspace Scripts](#workspace-scripts)
- [Environment Configuration](#environment-configuration)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Client Features](#client-features)
- [License](#license)

---

## Overview

Modern short-form video feeds contain immense educational, culinary, technical, and informational value, but:
- Scrubbing through videos to find a specific recipe quantity or line of code is tedious.
- Saved video collections quickly become cluttered and unsearchable.
- Key takeaways are lost once the video ends.

Digestible solves this by extracting spoken audio and visual metadata, generating structured takeaways, step-by-step checklists, viral hook scores, and full searchable transcripts using multimodal LLMs via OpenRouter.

---

## Workspace Architecture

Digestible uses npm workspaces partitioned strictly into `client/` and `server/`:

```
digestible/
├── package.json               # Root workspace configuration & unified scripts
├── package-lock.json
├── schema.sql                 # Supabase PostgreSQL schema and RLS policies
│
├── client/                    # Web Client (Vite + React 18)
│   ├── index.html             # HTML entry point with typography & SEO tags
│   ├── package.json           # @digestible/client
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # Bundler-mode TypeScript configuration
│   ├── public/                # Static assets (reels.svg, shorts.svg, tiktok.svg)
│   └── src/
│       ├── main.tsx           # React DOM root entry
│       ├── App.tsx            # Root view switcher (Landing Page ↔ Summarizer)
│       ├── index.css          # Design system tokens, utilities & animations
│       ├── types/             # Frontend data contract definitions
│       │   └── digest.ts      # Domain models (ReelSummaryResult, TaskStatus, etc.)
│       └── components/        # UI components
│           ├── Navbar.tsx     # Floating blur navbar with responsive mobile drawer
│           ├── Hero.tsx       # Hero section with animated integration marquee
│           ├── HubDiagram.tsx # Interactive Before → After pipeline comparison
│           ├── BentoGrid.tsx  # Dark-mode bento feature showcase
│           ├── HowItWorks.tsx # 3-step interactive accordion workflow
│           ├── Pricing.tsx    # Tier cards with monthly / annual billing toggle
│           ├── FAQ.tsx        # Expandable accordion FAQ
│           ├── Footer.tsx     # Editorial footer with navigation directory
│           ├── Logo.tsx       # Digestible Abstract "D" SVG branding
│           └── SummarizerPage.tsx # Full interactive summarizer view & results tab
│
└── server/                    # Backend & Workers (Node.js + Express + BullMQ)
    ├── package.json           # @digestible/server
    ├── tsconfig.json          # Node/CommonJS TypeScript configuration
    ├── yt-dlp                 # Standalone yt-dlp executable for reel streams
    └── src/
        ├── index.ts           # Express HTTP server & worker bootstrap
        ├── config/            # Infrastructure configuration
        │   ├── env.ts         # Zod-validated environment variables
        │   ├── redis.ts       # IORedis connection options
        │   └── supabase.ts    # Supabase admin & anon client instances
        ├── routes/
        │   └── tasks.router.ts # Task creation and retrieval endpoints
        ├── queues/
        │   └── summarization.queue.ts # BullMQ queue definition & job dispatch
        ├── workers/
        │   └── summarization.worker.ts # Background worker processing pipeline
        ├── services/          # Core media & AI provider services
        │   ├── audioExtractor.ts      # FFmpeg audio isolate & duration probe
        │   ├── videoExtractor.ts      # yt-dlp media downloader & buffer pipeline
        │   ├── openrouter.ts          # OpenRouter multimodal LLM client
        │   └── aiProvider.ts          # Unified AI service facade
        └── shared/            # Contract schemas & domain interfaces
            ├── index.ts       # Shared module entry point
            ├── schemas.ts     # Zod schemas (createTaskSchema, reelSummarySchema)
            └── types.ts       # Domain types (TaskRecord, VideoMetadata, etc.)
```

---

## Processing Pipeline

```
[ Web Client / User ]
         |
         | 1. Submit reel URL + optional focus prompt
         v
+--------------------------------------------------------------+
|                    Express API (@digestible/server)          |
|  - Validates request payload against Zod schemas             |
|  - Inserts pending task record into Supabase                 |
|  - Enqueues background job into BullMQ                       |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                    Redis BullMQ Queue                        |
|  - Manages concurrency, exponential backoff, and retries     |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                     Async Worker Pipeline                    |
|  1. Media Stream: yt-dlp extracts real MP4 video stream      |
|  2. Audio Extraction: FFmpeg isolates high-clarity MP3 audio |
|  3. Multimodal AI: OpenRouter (Claude 3.5 / Gemini 2.5)      |
|     generates structured key takeaways, steps, hooks & tags  |
|  4. Database Update: Supabase row updated to 'completed'     |
|     with structured JSONB summary payload                    |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                     Supabase PostgreSQL                      |
|  - Real-time client updates via Supabase subscriptions       |
+--------------------------------------------------------------+
```

---

## Technology Stack

### Workspace & Tooling
- **Package Manager**: npm workspaces (`client`, `server`)
- **Language**: TypeScript 5.7
- **Schema Validation**: Zod 3.23

### Frontend (`client/`)
- **Framework**: React 18, Vite 6
- **Icons**: Lucide React
- **Typography**: Instrument Serif, Montserrat, Oswald, SF Pro Display
- **Styling**: Custom CSS design system with HSL variables, fluid typography, glassmorphism, and responsive breakpoints

### Backend (`server/`)
- **Runtime**: Node.js, Express 4
- **Process Execution**: `ts-node-dev` (development) / `tsc` (production)
- **Background Queuing**: BullMQ 5 with Redis (`ioredis` 5)
- **Database & Realtime**: Supabase (`@supabase/supabase-js` 2)
- **AI Engine**: OpenRouter API (Claude 3.5 Sonnet, Gemini 2.5 Flash, Auto)
- **Media Processing**: `yt-dlp`, FFmpeg (`fluent-ffmpeg`)

---

## Prerequisites & System Dependencies

Ensure the following tools are installed on your system:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Redis Server**: Running locally on port `6379` (or accessible via URL)
- **FFmpeg**: Installed and accessible in your system `PATH` (for audio extraction)
- **Python 3**: Required to run the local `yt-dlp` executable
- **Supabase**: An active Supabase project with `schema.sql` applied

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd digestible
npm install
```

### 2. Configure Environment Variables

Create `server/.env` with your credentials:

```bash
cp server/.env.example server/.env # or configure manually
```

Ensure Redis is running:
```bash
redis-server
```

### 3. Run Development Servers

In the root directory, start the backend and frontend in separate terminals:

```bash
# Terminal 1: Backend API Server & BullMQ Worker (Port 4000)
npm run dev:server

# Terminal 2: Vite Web Client (Port 5173)
npm run dev:client
```

Open `http://localhost:5173` to explore the application.

---

## Workspace Scripts

All workspace tasks can be run directly from the root `package.json`:

| Command | Description |
| :--- | :--- |
| `npm run dev:server` | Starts Express server with hot-reloading (`ts-node-dev`) |
| `npm run dev:client` | Launches Vite local development server |
| `npm run build:server` | Compiles backend TypeScript to `server/dist/` |
| `npm run build:client` | Compiles production client bundle via Vite |
| `npm run check-types` | Executes `tsc --noEmit` across both `client` and `server` |

---

## Environment Configuration

### Server Configuration (`server/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | HTTP port for Express API | `4000` |
| `NODE_ENV` | Environment mode | `development` |
| `REDIS_HOST` | Redis host for BullMQ queues | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Optional Redis password | `""` |
| `SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase public anon key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (write permissions) | `eyJhbGciOi...` |
| `OPENROUTER_API_KEY` | OpenRouter API Key for commercial LLMs | `sk-or-v1-...` |
| `OPENROUTER_MODEL` | Target OpenRouter model identifier | `openrouter/auto` |

---

## Database Schema

Apply `schema.sql` in your Supabase SQL Editor:

- **Custom Enum**: `summary_status ('pending', 'processing', 'completed', 'failed')`
- **Table `public.summaries`**:
  - `id`: UUID (Primary Key, auto-generated)
  - `user_id`: UUID (Optional foreign key to `auth.users`)
  - `reel_url`: TEXT (Source URL)
  - `prompt`: TEXT (Optional custom focus prompt)
  - `status`: `summary_status` (Default: `'pending'`)
  - `summary_data`: JSONB (Structured summary payload)
  - `error_message`: TEXT (Captured failures)
  - `created_at` / `updated_at`: Timestamps with automatic trigger
- **Row Level Security (RLS)**:
  - Public read access for summaries
  - Insert access for authenticated & anonymous users
  - Service role full access for background worker updates

---

## API Reference

### Health Check
```http
GET /health
```
Response:
```json
{
  "status": "ok",
  "service": "digestible-server",
  "timestamp": "2026-09-11T10:00:00.000Z"
}
```

### Submit Reel for Processing
```http
POST /api/tasks
Content-Type: application/json
```
Request Body:
```json
{
  "reelUrl": "https://www.instagram.com/reel/C8SalmonDemo/",
  "prompt": "Extract the exact cooking temperature and ingredients"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "taskId": "7e3b9c02-...",
    "status": "pending",
    "message": "Task created and enqueued for AI summarization"
  }
}
```

### Get Task Status & Results
```http
GET /api/tasks/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "7e3b9c02-...",
    "reel_url": "https://www.instagram.com/reel/C8SalmonDemo/",
    "status": "completed",
    "summary_data": {
      "title": "High-Protein Garlic Butter Salmon in 20 Minutes",
      "summary": "A fast, nutrient-dense recipe for pan-seared salmon...",
      "keyTakeaways": ["Pat salmon dry...", "Sear skin-side down for 4 min..."],
      "viralHook": {
        "hookText": "\"Stop overcooking your salmon! Do this 1 trick instead...\"",
        "hookEffectivenessScore": 94
      },
      "stepByStepInstructions": [
        { "stepNumber": 1, "title": "Dry Fillet", "detail": "Remove surface moisture..." }
      ],
      "estimatedReadTime": "25 seconds",
      "category": "Recipe & Nutrition"
    }
  }
}
```

---

## Client Features

- **Interactive Reel Summarizer Dashboard**: Paste any video reel link, add an optional custom focus prompt, and inspect instant structured output across multiple view tabs (Summary, Key Takeaways, Transcript, Checklist).
- **Hero & Brand Marquee**: Smooth infinite marquee showcasing Instagram Reels, YouTube Shorts, and TikTok platform support.
- **Before & After Visual Funnel (`HubDiagram`)**: Visual comparison showing how scattered, chaotic saved videos transform into clean, organized knowledge cards.
- **Bento Feature Grid**: Dark-mode bento showcasing video workspace organization, viral hook psychology scores, and step-by-step tutorial checklists.
- **Full-Screen Responsive Drawer**: Mobile-friendly navigation overlay with smooth blur transitions.

---

## License

This project is private and proprietary.
