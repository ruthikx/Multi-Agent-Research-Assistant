import { FileText } from "lucide-react";

import { MarkdownContent } from "@/components/markdown-content";
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
          <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-2 text-[hsl(var(--accent))]">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Generated Report</CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              The research synthesis and review land here as the run progresses.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-5">
          {report ? (
            <MarkdownContent content={report} />
          ) : (
            <div className="flex min-h-[280px] items-center justify-center px-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
              <div>
                <p className="text-base font-medium text-[hsl(var(--foreground))]">Report is being drafted</p>
                <p className="mt-2">{loading ? `${stageLabel}...` : "Submit a topic to start the research workflow."}</p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">Critic feedback</p>
            <p className="text-xs tracking-[0.08em] text-[hsl(var(--subtle-foreground))]">Post-run review</p>
          </div>
          {feedback ? (
            <MarkdownContent content={feedback} className="text-sm" />
          ) : (
            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              The critic will review the report after the writer chain completes.
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
