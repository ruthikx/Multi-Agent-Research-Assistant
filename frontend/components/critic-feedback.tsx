import { MessageSquareQuote } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CriticFeedback({ feedback }: { feedback: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-indigo-200">
            <MessageSquareQuote className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Critic Feedback</CardTitle>
            <p className="text-sm text-slate-400">A post-run review of strengths, gaps, and confidence.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap rounded-[24px] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-200">
          {feedback || "The critic will review the report after the writer chain completes."}
        </pre>
      </CardContent>
    </Card>
  );
}
