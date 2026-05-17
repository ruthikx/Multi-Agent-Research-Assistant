# Multi-Agent Research Assistant

A production-style, full-stack AI research workspace that coordinates a four-stage multi-agent pipeline — from live web search to final critic review — with a polished dark UI and real-time progress streaming.

🔗 **Live Demo:** [multi-agent-research-assistance.netlify.app](https://multi-agent-research-assistance.netlify.app)

---

## How It Works

Enter a research topic and the pipeline kicks off four sequential agents:

1. **Search Agent** — queries the web via Tavily Search and retrieves relevant results
2. **Reader Agent** — scrapes and extracts content from the returned URLs using BeautifulSoup
3. **Writer Chain** — synthesizes the scraped content into a structured report using Mistral AI via LangChain
4. **Critic Chain** — reviews the generated report and provides structured feedback

The frontend streams each stage's progress in real time via a Next.js API proxy, so the browser never talks to FastAPI directly.

---

## Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** for animations
- **shadcn/ui**-style components

### Backend
- **FastAPI** (Python)
- **LangChain** orchestration
- **Mistral AI** for LLM inference
- **Tavily Search** for web retrieval
- **BeautifulSoup** for HTML scraping

---

## Features

- Dark glassmorphism AI workspace layout
- Live streaming pipeline progress via newline-delimited JSON
- Collapsible execution cards per agent stage
- Typing-style animated report reveal
- Critic feedback panel rendered separately from the report
- Agent status sidebar with compact stage indicators
- Responsive design, mobile-friendly
- Next.js API proxy — no direct browser-to-FastAPI calls
- CORS and environment variable support throughout

---

## Project Structure

```
.
├── backend/
│   ├── __init__.py
│   ├── .env.example
│   ├── agents.py          # Agent definitions
│   ├── main.py            # FastAPI app
│   ├── pipeline.py        # Orchestration logic
│   ├── schemas.py         # Pydantic models
│   ├── settings.py        # Config / env loading
│   └── tools.py           # Search & scraping tools
├── frontend/
│   ├── app/
│   │   ├── actions.ts
│   │   ├── api/research/
│   │   │   ├── route.ts          # Standard endpoint proxy
│   │   │   └── stream/route.ts   # Streaming endpoint proxy
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   ├── services/
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── agents.py              # Root-level copies (legacy)
├── pipeline.py
├── tools.py
├── requirements.txt
└── .env.example
```

---

## Backend API

### `GET /health`
Returns service status. Useful for uptime checks and deployment health probes.

### `POST /research`
Runs the full pipeline and returns a structured JSON response:

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
Streams pipeline progress as newline-delimited JSON events, then ends with the same report payload. This is the endpoint the frontend uses for live stage updates.

---

## Environment Setup

### Backend

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
MISTRAL_API_KEY=your_mistral_key
TAVILY_API_KEY=your_tavily_key
MISTRAL_MODEL=mistral-medium   # or your preferred model
CORS_ORIGINS=http://localhost:3000
```

### Frontend

Copy `frontend/.env.example` to `frontend/.env.local` and set:

```env
BACKEND_API_URL=http://127.0.0.1:8000
```

---

## Installation

### Python backend

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### Next.js frontend

```bash
cd frontend
npm install
```

---

## Running Locally

### Start the backend

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Start the frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Notes

- Valid **Mistral** and **Tavily** API keys are required before any research run will succeed.
- The root-level `agents.py`, `pipeline.py`, and `tools.py` are legacy files left in place for reference; the canonical versions live inside `backend/`.
- The streaming UI is powered by a Next.js route handler acting as a proxy, keeping all FastAPI calls server-side.