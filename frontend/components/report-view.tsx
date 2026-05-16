import { FileText } from "lucide-react";

import { TypingText } from "@/components/typing-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportView({
  report,
  loading,
  stageLabel,
}: {
  report: string;
  loading: boolean;
  stageLabel: string;
}) {
  return (
    <Card className="min-h-[420px]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-cyan-200">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Generated Report</CardTitle>
            <p className="text-sm text-slate-400">The final research synthesis appears here.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {report ? (
          <TypingText text={report} active speed={6} />
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/20 px-8 text-center text-sm text-slate-400">
            <div>
              <p className="font-display text-lg text-white">Report is being drafted</p>
              <p className="mt-2">{loading ? `${stageLabel}...` : "Submit a topic to start the research workflow."}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
