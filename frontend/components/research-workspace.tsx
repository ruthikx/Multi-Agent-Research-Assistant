"use client";

import { Activity, AlertTriangle, Bot, FileSearch2, PenSquare, SearchCode, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useTransition } from "react";

import { saveLastTopicAction } from "@/app/actions";
import { ResearchForm } from "@/components/research-form";
import { ReportView } from "@/components/report-view";
import { StepCard } from "@/components/step-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PipelineStep, ProgressEvent, ResearchResponse, StageName } from "@/lib/types";
import { streamResearch } from "@/services/research-client";

const baseSteps: PipelineStep[] = [
  { stage: "search", label: "Searching Web", status: "idle", detail: "Waiting to start the search agent." },
  { stage: "read", label: "Reading Sources", status: "idle", detail: "Waiting to start the reader agent." },
  { stage: "write", label: "Writing Report", status: "idle", detail: "Waiting to start the writer chain." },
  { stage: "critique", label: "Critiquing Report", status: "idle", detail: "Waiting to start the critic chain." },
];

const stageOrdering: StageName[] = ["search", "read", "write", "critique"];

const stageMeta: Record<
  StageName,
  { shortName: string; fullName: string; icon: typeof SearchCode }
> = {
  search: { shortName: "Search Agent", fullName: "Search Agent", icon: SearchCode },
  read: { shortName: "Reader Agent", fullName: "Reader Agent", icon: FileSearch2 },
  write: { shortName: "Writer Chain", fullName: "Writer Chain", icon: PenSquare },
  critique: { shortName: "Critic Chain", fullName: "Critic Chain", icon: ShieldCheck },
};

const statusLabelMap = {
  idle: "Idle",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
} as const;

function mergeStepState(existingSteps: PipelineStep[], event: ProgressEvent): PipelineStep[] {
  if (!event.stage || !event.label || !event.status || !event.detail) {
    return existingSteps;
  }

  const nextSteps = [...existingSteps];
  const targetIndex = nextSteps.findIndex((step) => step.stage === event.stage);
  const nextStep: PipelineStep = {
    stage: event.stage,
    label: event.label,
    status: event.status,
    detail: event.detail,
    content: event.content,
  };

  if (targetIndex >= 0) {
    nextSteps[targetIndex] = {
      ...nextSteps[targetIndex],
      ...nextStep,
      content: event.content ?? nextSteps[targetIndex].content,
    };
  } else {
    nextSteps.push(nextStep);
  }

  return nextSteps.sort(
    (left, right) => stageOrdering.indexOf(left.stage) - stageOrdering.indexOf(right.stage)
  );
}

export function ResearchWorkspace({ initialTopic }: { initialTopic?: string }) {
  const [steps, setSteps] = useState<PipelineStep[]>(baseSteps);
  const [response, setResponse] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  const activeStage = steps.find((step) => step.status === "running")?.label || "Standing by";

  async function handleResearch(topic: string) {
    setLoading(true);
    setError(null);
    setResponse(null);
    setSteps(baseSteps);

    startTransition(() => {
      void saveLastTopicAction(topic);
    });

    try {
      await streamResearch(topic, {
        onEvent: (event) => {
          if (event.type === "progress") {
            setSteps((current) => mergeStepState(current, event));
            return;
          }

          if (event.type === "final" && event.data) {
            setResponse(event.data);
            setSteps(event.data.steps);
            setLoading(false);
            return;
          }

          if (event.type === "error") {
            setError(event.message || "The backend returned an unexpected error.");
            setLoading(false);
            setSteps((current) =>
              current.map((step) =>
                step.status === "running" ? { ...step, status: "failed", detail: event.message || step.detail } : step
              )
            );
          }
        },
      });
    } catch (streamError) {
      setLoading(false);
      setError(streamError instanceof Error ? streamError.message : "The research request failed.");
    }
  }

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Research workspace</Badge>
              <Badge variant="muted" className="gap-2">
                <Activity className="h-3.5 w-3.5" />
                Live pipeline updates
              </Badge>
            </div>
            <ThemeToggle />
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="max-w-4xl text-3xl font-medium leading-tight text-[hsl(var(--foreground))] md:text-4xl">
                A focused workspace for multi-agent research.
              </h1>
              <p className="mt-3 max-w-4xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
                Run the team, follow each stage, and review the final synthesis without the usual AI dashboard clutter.
              </p>
            </div>
            <Card className="shadow-sm">
              <div className="flex flex-wrap items-center gap-3 p-5">
                {steps.map((step) => {
                  const meta = stageMeta[step.stage];
                  const Icon = meta.icon;

                  return (
                    <div
                      key={step.stage}
                      className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2 text-sm text-[hsl(var(--panel-foreground))]"
                    >
                      <Icon className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <span className="font-medium text-[hsl(var(--foreground))]">{meta.fullName}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
            <ResearchForm onSubmit={handleResearch} loading={loading} initialTopic={initialTopic} />
          </div>
        </div>
      </motion.section>

      {error ? (
        <Card className="border-rose-500/20 bg-rose-500/10 p-5 text-rose-500">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-medium">Research run failed</p>
              <p className="mt-1 text-sm text-rose-500/90">{error}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(320px,1fr)]">
        <div>
          <ReportView
            report={response?.report || ""}
            feedback={response?.feedback || ""}
            loading={loading}
            stageLabel={activeStage}
          />
        </div>
        <div className="space-y-4">
          <Card>
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-2 text-[hsl(var(--accent))]">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">Agent status</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Compact view of each active stage.</p>
                </div>
              </div>
              <div className="space-y-2">
                {steps.map((step) => {
                  const meta = stageMeta[step.stage];
                  const Icon = meta.icon;

                  return (
                    <div
                      key={`${step.stage}-status`}
                      className="flex items-center justify-between gap-3 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-full bg-[hsl(var(--accent)/0.12)] p-1.5 text-[hsl(var(--accent))]">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">{meta.shortName}</p>
                          <p className="truncate text-xs text-[hsl(var(--subtle-foreground))]">{step.detail}</p>
                        </div>
                      </div>
                      <Badge
                        variant={step.status === "failed" ? "danger" : step.status === "idle" ? "muted" : "default"}
                        className="shrink-0"
                      >
                        {statusLabelMap[step.status]}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 p-5 pb-0">
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-2 text-[hsl(var(--accent))]">
                <SearchCode className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">Execution trace</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {loading ? `${activeStage}...` : "Detailed outputs from each stage."}
                </p>
              </div>
            </div>
            <div className="space-y-4 p-5">
              {steps.map((step, index) => (
                <StepCard
                  key={`${step.stage}-${index}-${step.status}`}
                  step={step}
                  openByDefault={step.status === "running" || step.status === "completed"}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
