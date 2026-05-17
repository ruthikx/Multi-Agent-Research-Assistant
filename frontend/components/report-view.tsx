import { FileText } from "lucide-react";

import { TypingText } from "@/components/typing-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportView({
  report,
  feedback,
  loading,
  stageLabel,
}: {
  report: string;
  feedback?: string;
  loading: boolean;
  stageLabel: string;
}) {
  return (
    <Card className="min-h-[560px]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-white/10 bg-[#1e2535] p-2 text-cyan-200">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Generated Report</CardTitle>
            <p className="text-sm text-slate-400">The research synthesis and review land here as the run progresses.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="rounded-xl border border-white/10 bg-[#1e2535] p-5">
          {report ? (
            <TypingText text={report} active speed={6} />
          ) : (
            <div className="flex min-h-[280px] items-center justify-center px-8 text-center text-sm text-slate-400">
              <div>
                <p className="text-base font-medium text-white">Report is being drafted</p>
                <p className="mt-2">{loading ? `${stageLabel}...` : "Submit a topic to start the research workflow."}</p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-[#1e2535] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-white">Critic feedback</p>
            <p className="text-xs tracking-[0.08em] text-slate-500">Post-run review</p>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
            {feedback || "The critic will review the report after the writer chain completes."}
          </pre>
        </section>
      </CardContent>
    </Card>
  );
}
