import { BrainCircuit, FileSearch, Radar, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const phases = [
  { title: "Search Agent", detail: "Finds timely, high-signal sources.", icon: Radar },
  { title: "Reader Agent", detail: "Scrapes and distills source pages.", icon: FileSearch },
  { title: "Writer Chain", detail: "Builds the final report narrative.", icon: Sparkles },
  { title: "Critic Chain", detail: "Scores the report and surfaces gaps.", icon: BrainCircuit },
];

export function AppSidebar({ lastTopic }: { lastTopic?: string }) {
  return (
    <aside className="w-full max-w-sm shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
      <Card className="relative h-full overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_35%)]" />
        <div className="relative flex h-full flex-col gap-6">
          <div className="space-y-4">
            <Badge>Multi-Agent Research</Badge>
            <div>
              <h1 className="font-display text-3xl font-semibold text-white">Research faster with a coordinated AI team.</h1>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
                A dark, portfolio-ready workspace for search, source reading, report drafting, and critical review.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {phases.map((phase) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-cyan-200">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-white">{phase.title}</h2>
                      <p className="text-xs text-slate-400">{phase.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto rounded-3xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Last Topic</p>
            <p className="mt-3 text-sm text-slate-200">{lastTopic || "No topic stored yet. Your latest query will appear here."}</p>
          </div>
        </div>
      </Card>
    </aside>
  );
}
