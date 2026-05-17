"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/status-pill";
import type { PipelineStep } from "@/lib/types";

export function StepCard({ step, openByDefault = false }: { step: PipelineStep; openByDefault?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      <Card className="overflow-hidden">
        <details className="group" open={openByDefault}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.08em] text-slate-500">{step.stage}</p>
              <h3 className="mt-1 text-sm font-medium text-white">{step.label}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">{step.detail}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={step.status} />
              <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
            </div>
          </summary>
          <div className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-slate-300">
            {step.content ? <pre className="whitespace-pre-wrap font-body">{step.content}</pre> : "Waiting for this stage to produce output."}
          </div>
        </details>
      </Card>
    </motion.div>
  );
}
