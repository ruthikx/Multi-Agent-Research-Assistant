# Multi-Agent Research Assistant

A production-style full-stack AI research assistant built with a modern Next.js 15 frontend and a FastAPI backend. The app coordinates a four-stage research workflow:

1. Search Agent
2. Reader/Scraper Agent
3. Writer Chain
4. Critic Chain

The UI is designed as a polished dark AI workspace with live progress updates, collapsible execution cards, a generated report panel, and critic feedback.

## Stack

### Frontend

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Framer Motion

### Backend

- FastAPI
- Python
- LangChain
- Mistral AI
- Tavily Search
- BeautifulSoup scraping

## Folder Structure

```text
.
├── backend
│   ├── __init__.py
│   ├── .env.example
│   ├── agents.py
│   ├── main.py
│   ├── pipeline.py
│   ├── schemas.py
│   ├── settings.py
│   └── tools.py
├── frontend
│   ├── .env.example
│   ├── app
│   │   ├── actions.ts
│   │   ├── api
│   │   │   └── research
│   │   │       ├── route.ts
│   │   │       └── stream
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   ├── lib
│   ├── services
│   ├── components.json
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── .env.example
├── agents.py
├── pipeline.py
├── tools.py
└── requirements.txt
```

## Features

- Modern glassmorphism AI SaaS layout
- Responsive sidebar and workspace
- Dark mode-first visual design
- Live streaming pipeline progress
- Collapsible agent execution cards
- Typing-style report reveal
- Critic review panel
- FastAPI health and research endpoints
- CORS and environment variable support
- Async search and scraping flow

## Backend API

### `GET /health`

Returns service status.

### `POST /research`

Runs the pipeline and returns structured JSON:

```json
{
  "search_results": "...",
  "scraped_content": "...",
  "report": "...",
  "feedback": "...",
  "steps": []
}
```

### `POST /research/stream`

Streams progress events as newline-delimited JSON and finishes with the same report payload. The frontend uses this endpoint for live execution updates.

## Environment Setup

### Backend

Copy [backend/.env.example](backend/.env.example) to `backend/.env` and fill in:

- `MISTRAL_API_KEY`
- `TAVILY_API_KEY`
- `MISTRAL_MODEL`
- `CORS_ORIGINS`

### Frontend

Copy [frontend/.env.example](frontend/.env.example) to `frontend/.env.local` and set:

- `BACKEND_API_URL=http://127.0.0.1:8000`

## Install

### Python backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Next.js frontend

```bash
cd frontend
npm install
```

## Run

### Start backend

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Start frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

## Notes

- The original root-level `agents.py`, `pipeline.py`, and `tools.py` were left in place.
- The app expects valid Mistral and Tavily credentials before research runs will succeed.
- The streaming UI is powered through a Next.js API proxy so the browser never has to call FastAPI directly.
