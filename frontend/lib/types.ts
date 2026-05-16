export type StageName = "search" | "read" | "write" | "critique";
export type StageStatus = "idle" | "running" | "completed" | "failed";

export interface PipelineStep {
  stage: StageName;
  label: string;
  status: StageStatus;
  detail: string;
  content?: string | null;
}

export interface ResearchResponse {
  search_results: string;
  scraped_content: string;
  report: string;
  feedback: string;
  steps: PipelineStep[];
}

export interface ProgressEvent {
  type: "progress" | "final" | "error";
  stage?: StageName | null;
  label?: string | null;
  status?: StageStatus | null;
  detail?: string | null;
  content?: string | null;
  data?: ResearchResponse | null;
  message?: string | null;
}
