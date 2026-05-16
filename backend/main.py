import asyncio
import contextlib

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from backend.pipeline import run_research_pipeline
from backend.schemas import HealthResponse, ProgressEvent, ResearchRequest, ResearchResponse
from backend.settings import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_name, version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", environment=settings.app_env)


@app.post("/research", response_model=ResearchResponse)
async def research(payload: ResearchRequest) -> ResearchResponse:
    try:
        result = await run_research_pipeline(payload.topic)
        return ResearchResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/research/stream")
async def research_stream(payload: ResearchRequest) -> StreamingResponse:
    async def generator():
        queue: asyncio.Queue[str | None] = asyncio.Queue()

        async def publish_progress(step):
            event = ProgressEvent(
                type="progress",
                stage=step.stage,
                label=step.label,
                status=step.status,
                detail=step.detail,
                content=step.content,
            )
            await queue.put(event.model_dump_json())

        async def runner():
            try:
                result = await run_research_pipeline(payload.topic, on_progress=publish_progress)
                event = ProgressEvent(type="final", data=ResearchResponse(**result))
                await queue.put(event.model_dump_json())
            except Exception as exc:
                await queue.put(
                    ProgressEvent(type="error", message=str(exc)).model_dump_json()
                )
            finally:
                await queue.put(None)

        task = asyncio.create_task(runner())
        try:
            while True:
                item = await queue.get()
                if item is None:
                    break
                yield f"{item}\n"
        finally:
            task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await task

    return StreamingResponse(generator(), media_type="application/x-ndjson")
