"use client";

import { Activity, AlertTriangle, SearchCode } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useTransition } from "react";

import { saveLastTopicAction } from "@/app/actions";
import { CriticFeedback } from "@/components/critic-feedback";
import { ResearchForm } from "@/components/research-form";
import { ReportView } from "@/components/report-view";
import { StepCard } from "@/components/step-card";
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
    <div className="flex-1 space-y-6">
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Badge>AI Research Workspace</Badge>
          <Badge variant="muted" className="gap-2">
            <Activity className="h-3.5 w-3.5" />
            Live Pipeline Updates
          </Badge>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-4xl leading-tight text-white md:text-5xl">
              Modern research workflows with visible agent reasoning.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Ask a question, watch each agent progress in real time, then review the generated report and critic feedback in one place.
            </p>
          </div>
          <ResearchForm onSubmit={handleResearch} loading={loading} initialTopic={initialTopic} />
        </div>
      </motion.section>

      {error ? (
        <Card className="border-rose-400/20 bg-rose-500/10 p-5 text-rose-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-medium">Research run failed</p>
              <p className="mt-1 text-sm text-rose-100/80">{error}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <ReportView report={response?.report || ""} loading={loading} stageLabel={activeStage} />
          <CriticFeedback feedback={response?.feedback || ""} />
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-cyan-200">
                <SearchCode className="h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-lg text-white">Execution Trace</p>
                <p className="text-sm text-slate-400">
                  {loading ? `${activeStage}...` : "Each agent stage is captured in a collapsible card."}
                </p>
              </div>
            </div>
          </Card>

          {steps.map((step, index) => (
            <StepCard
              key={`${step.stage}-${index}-${step.status}`}
              step={step}
              openByDefault={step.status === "running" || step.status === "completed"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
