from typing import Literal

from pydantic import BaseModel, Field


StageName = Literal["search", "read", "write", "critique"]
StageStatus = Literal["idle", "running", "completed", "failed"]


class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=400)


class HealthResponse(BaseModel):
    status: Literal["ok"]
    environment: str


class PipelineStep(BaseModel):
    stage: StageName
    label: str
    status: StageStatus
    detail: str
    content: str | None = None


class ResearchResponse(BaseModel):
    search_results: str
    scraped_content: str
    report: str
    feedback: str
    steps: list[PipelineStep]


class ProgressEvent(BaseModel):
    type: Literal["progress", "final", "error"]
    stage: StageName | None = None
    label: str | None = None
    status: StageStatus | None = None
    detail: str | None = None
    content: str | None = None
    data: ResearchResponse | None = None
    message: str | None = None
