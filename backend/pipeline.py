import inspect
from typing import Awaitable, Callable

from backend.agents import run_critic_chain, run_reader_agent, run_search_agent, run_writer_chain
from backend.schemas import PipelineStep

ProgressCallback = Callable[[PipelineStep], Awaitable[None] | None]

STEP_LABELS = {
    "search": "Searching Web",
    "read": "Reading Sources",
    "write": "Writing Report",
    "critique": "Critiquing Report",
}


async def _emit(
    callback: ProgressCallback | None,
    *,
    stage: str,
    status: str,
    detail: str,
    content: str | None = None,
) -> PipelineStep:
    step = PipelineStep(
        stage=stage,  # type: ignore[arg-type]
        label=STEP_LABELS[stage],
        status=status,  # type: ignore[arg-type]
        detail=detail,
        content=content,
    )
    if callback is not None:
        outcome = callback(step)
        if inspect.isawaitable(outcome):
            await outcome
    return step


async def run_research_pipeline(
    topic: str,
    on_progress: ProgressCallback | None = None,
) -> dict:
    steps: list[PipelineStep] = []

    steps.append(
        await _emit(
            on_progress,
            stage="search",
            status="running",
            detail=f'Collecting recent sources for "{topic}".',
        )
    )
    search_state = await run_search_agent(topic)
    steps.append(
        await _emit(
            on_progress,
            stage="search",
            status="completed",
            detail="Search agent ranked and summarized the source set.",
            content=search_state["summary"],
        )
    )

    steps.append(
        await _emit(
            on_progress,
            stage="read",
            status="running",
            detail="Scraping and synthesizing the most relevant sources.",
        )
    )
    reader_state = await run_reader_agent(topic, search_state["results"])
    steps.append(
        await _emit(
            on_progress,
            stage="read",
            status="completed",
            detail="Reader agent extracted and condensed deeper source content.",
            content=reader_state["synthesis"],
        )
    )

    steps.append(
        await _emit(
            on_progress,
            stage="write",
            status="running",
            detail="Drafting the final research report.",
        )
    )
    report = await run_writer_chain(topic, search_state["summary"], reader_state["synthesis"])
    steps.append(
        await _emit(
            on_progress,
            stage="write",
            status="completed",
            detail="Writer chain produced the portfolio-ready report draft.",
            content=report,
        )
    )

    steps.append(
        await _emit(
            on_progress,
            stage="critique",
            status="running",
            detail="Reviewing the report for weaknesses and improvement opportunities.",
        )
    )
    feedback = await run_critic_chain(report)
    steps.append(
        await _emit(
            on_progress,
            stage="critique",
            status="completed",
            detail="Critic chain returned a scored review.",
            content=feedback,
        )
    )

    return {
        "search_results": search_state["summary"],
        "scraped_content": reader_state["synthesis"],
        "report": report,
        "feedback": feedback,
        "steps": steps,
    }
