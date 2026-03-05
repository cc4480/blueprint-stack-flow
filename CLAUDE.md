# CLAUDE.md — NoCodeLos Blueprint Stack

This file provides context for AI assistants working on this codebase.

---

## Project Overview

**NoCodeLos Blueprint Stack** is a full-stack web application that combines AI-powered blueprint generation with educational tools for vibe-coders and prompt engineers. Core capabilities include:

- Real-time AI blueprint generation (DeepSeek API via SSE streaming)
- RAG 2.0 Hub for document retrieval and embedding
- MCP Center for Model Context Protocol server management
- A2A (Agent-to-Agent) communication framework
- Prompt Studio for advanced DeepSeek prompt engineering
- Comprehensive tutorial system with interactive learning paths
- Analytics dashboard with real-time performance monitoring

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18.3, TypeScript 5.6, Vite 5.4 |
| Styling | Tailwind CSS 3.4, shadcn/ui (Radix UI), CSS variables |
| Routing | React Router v7 |
| Data Fetching | TanStack React Query 5 |
| Forms | React Hook Form 7 + Zod |
| Backend | Express.js 4.21, TypeScript, tsx |
| Database | PostgreSQL 16 (Neon serverless), Drizzle ORM 0.39 |
| AI | DeepSeek API (`deepseek-reasoner` model) |
| Real-time | Server-Sent Events (SSE) |
| Auth | Passport.js (local strategy), express-session |

---

## Repository Structure

```
blueprint-stack-flow/
├── client/src/
│   ├── App.tsx               # Root app + React Router routes
│   ├── main.tsx              # React entry point
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives (40+ components, DO NOT edit manually)
│   │   ├── BlueprintGenerator.tsx
│   │   ├── ApiKeyManager.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── HeroSection.tsx
│   │   ├── InteractiveDemo.tsx
│   │   ├── Navigation.tsx
│   │   └── SystemStatus.tsx
│   ├── pages/
│   │   ├── Index.tsx         # Landing page
│   │   ├── Dashboard.tsx
│   │   ├── RAGHub.tsx
│   │   ├── MCPCenter.tsx
│   │   ├── PromptStudio.tsx
│   │   ├── A2AAgents.tsx
│   │   ├── Analytics.tsx
│   │   ├── Documentation.tsx # 65KB — extensive framework docs
│   │   ├── Tutorials.tsx
│   │   ├── Templates.tsx
│   │   ├── Projects.tsx
│   │   ├── Integrations.tsx
│   │   └── Settings.tsx
│   ├── services/
│   │   ├── analyticsService.ts
│   │   ├── performanceService.ts
│   │   └── promptService.ts
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useBuildingAnimation.ts
│   ├── utils/
│   │   ├── bugTracker.ts
│   │   ├── errorHandler.ts
│   │   ├── componentValidator.ts
│   │   └── performanceOptimizer.ts
│   └── lib/
│       ├── api.ts            # API client (all fetch calls go here)
│       └── utils.ts          # cn() and shared helpers
├── server/
│   ├── index.ts              # Express server entry, starts on port 5000
│   ├── routes.ts             # All API route handlers (~1200 lines)
│   ├── storage.ts            # Database access layer (~35KB)
│   ├── db.ts                 # Drizzle client initialization
│   ├── seed-data.ts          # Seed for templates & MCP servers
│   └── tutorial-seed-data.ts # Seed for tutorial content
├── shared/
│   └── schema.ts             # Drizzle schema — single source of truth for DB types
├── streaming-templates/      # Reference SSE streaming implementations
├── public/
│   └── ai-master-blueprint-template.md
├── replit.md                 # Project change log / history
└── database_analysis_report.md
```

---

## Development Commands

```bash
# Start dev server (frontend + backend on port 5000)
npm run dev

# TypeScript type check (no emit)
npm run check

# Push schema changes to PostgreSQL
npm run db:push

# Production build (Vite frontend + esbuild backend)
npm run build

# Run production build
npm run start
```

**No test runner is configured.** Use `npm run check` for type safety validation.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API key for AI features |
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | No | Defaults to `5000` |

The dev server runs on port **5000** (maps to external port 80 on Replit). Vite is configured with port **8080** for HMR but proxied through Express.

---

## Database

**ORM:** Drizzle with PostgreSQL dialect.
**Schema file:** `shared/schema.ts` — all table definitions live here. This is the single source of truth; TypeScript types are inferred from the schema.

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | Auth — username + hashed password |
| `blueprint_prompts` | Saved AI-generated blueprints with metadata |
| `rag_documents` | RAG document store with embedding support |
| `mcp_servers` | MCP server configurations |
| `a2a_agents` | Agent registry for A2A communication |
| `deepseek_conversations` | Conversation history + reasoning traces |
| `templates` | Reusable project templates |
| `system_metrics` | Performance monitoring data points |
| `analytics_events` | User behavior tracking |
| `tutorial_categories` | Tutorial taxonomy |
| `learning_paths` | Structured learning curricula |

### Schema Changes

1. Edit `shared/schema.ts`
2. Run `npm run db:push` to apply changes to the live database
3. Update `server/storage.ts` with new query methods
4. Add/update API routes in `server/routes.ts`

---

## API Structure

All routes are prefixed `/api` and defined in `server/routes.ts`.

### Key Endpoints

```
GET  /api/health                    — Health check
GET  /api/db/health                 — Database connectivity

# Blueprints
GET  /api/blueprints                — List saved blueprints
POST /api/blueprints                — Save blueprint
GET  /api/blueprints/:id
PUT  /api/blueprints/:id
DELETE /api/blueprints/:id
POST /api/stream-blueprint          — SSE: real-time blueprint generation

# RAG
GET  /api/rag/documents
POST /api/rag/documents
GET  /api/rag/queries
POST /api/rag/queries

# MCP
GET  /api/mcp/servers
POST /api/mcp/servers
PATCH /api/mcp/servers/:id/status
GET  /api/mcp/tool-executions
POST /api/mcp/tool-executions

# A2A
GET  /api/a2a/agents
POST /api/a2a/agents
GET  /api/a2a/tasks
POST /api/a2a/tasks

# DeepSeek
POST /api/deepseek/reason           — Reasoning with streaming
GET  /api/deepseek/conversations/:sessionId
POST /api/deepseek/conversations

# Templates
GET  /api/templates
POST /api/templates
GET  /api/templates/:id
GET  /api/templates/:id/download
POST /api/templates/:id/use

# Analytics
GET  /api/analytics/live
POST /api/analytics/events
GET  /api/analytics/metrics

# Tutorials
GET  /api/tutorials/categories
GET  /api/tutorials/learning-paths
GET  /api/tutorials/:id
POST /api/tutorials/progress
```

### Adding a New Endpoint

1. Add the Drizzle query in `server/storage.ts`
2. Register the route in `server/routes.ts`
3. Add the client-side fetch call in `client/src/lib/api.ts`
4. Consume via React Query in the component/page

---

## Frontend Conventions

### Component Patterns
- Pages live in `client/src/pages/`, reusable components in `client/src/components/`
- shadcn/ui components in `components/ui/` — use the CLI to add new ones, do not hand-edit
- Use `cn()` from `lib/utils.ts` for conditional class merging
- All server state goes through React Query; avoid local `useState` for fetched data

### Path Aliases
```ts
// tsconfig.json defines:
@/*       → client/src/*
@shared/* → shared/*
```

### Styling
- Tailwind CSS with CSS custom properties for theming
- Dark mode supported via `dark:` variants
- Design tokens in `tailwind.config.ts` and `client/src/index.css`
- shadcn/ui uses the `new-york` style variant

### Forms
- Use React Hook Form with Zod schemas for validation
- All schemas should be defined alongside the form component

---

## Streaming (SSE) Architecture

The `/api/stream-blueprint` endpoint uses Server-Sent Events for real-time blueprint generation:

```
Client → POST /api/stream-blueprint
Server → streams `data: {...}\n\n` events via SSE
Client → EventSource / fetch with ReadableStream
```

Key implementation details:
- Set `Content-Type: text/event-stream`, `Cache-Control: no-cache`
- Handle client disconnect with `req.on('close', ...)` to abort the DeepSeek request
- Use `AbortController` to cancel in-flight requests on disconnect
- Errors are sent as `data: {"error": "..."}` events, not HTTP error codes

Reference implementation: `streaming-templates/` directory.

---

## AI Integration

**Provider:** DeepSeek API
**Model:** `deepseek-reasoner` (primary), `deepseek-chat` (fallback)
**Key:** Stored in `DEEPSEEK_API_KEY` env var, accessed server-side only — never expose to client

The blueprint generation prompt is large (~9K–10K characters) and produces structured Markdown output. The system prompt is defined inline in `server/routes.ts` near the `/api/stream-blueprint` handler.

---

## Error Handling

- **Global error boundary:** `client/src/components/ErrorBoundary.tsx` wraps `<App />`
- **Unhandled rejections:** caught in `client/src/utils/errorHandler.ts`
- **Bug tracking:** `client/src/utils/bugTracker.ts` auto-detects and logs errors
- **Server errors:** Standard Express error middleware in `server/index.ts`

---

## Known Issues & Gaps

- **No automated tests** — `npm run check` (TypeScript) is the only automated quality gate
- **Missing CRUD** — Some entities (RAG documents, A2A agents) lack update/delete endpoints
- **No authentication middleware** — Routes are currently unauthenticated; Passport.js is configured but not enforced
- **No pagination** — List endpoints return all rows; add `limit`/`offset` before tables grow large
- **Legacy files** — `server/routes_backup.ts`, `server/routes_temp.ts`, and `src/integrations/supabase/` are unused; safe to ignore

---

## Git Workflow

Active development branch: `claude/claude-md-mmdztunqwtuh2xa8-GQz3c`

```bash
git add <specific files>
git commit -m "descriptive message"
git push -u origin claude/claude-md-mmdztunqwtuh2xa8-GQz3c
```

Commit messages should be imperative, lowercase, concise (e.g., `add pagination to rag documents endpoint`).

---

## Deployment

**Platform:** Replit
**Runtime:** Node.js 20, PostgreSQL 16
**Single-server architecture:** Express serves both the API and the Vite-built static frontend from `/dist`

Production build process:
1. `vite build` → outputs frontend to `dist/public/`
2. `esbuild server/index.ts` → outputs backend to `dist/index.js`
3. `node dist/index.js` starts the unified server
