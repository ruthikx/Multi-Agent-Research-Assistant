import { CheckCircle2, LoaderCircle, Orbit, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { StageStatus } from "@/lib/types";

const statusMap: Record<
  StageStatus,
  { label: string; variant: "default" | "muted" | "success" | "danger"; icon: typeof Orbit }
> = {
  idle: { label: "Idle", variant: "muted", icon: Orbit },
  running: { label: "Running", variant: "default", icon: LoaderCircle },
  completed: { label: "Completed", variant: "success", icon: CheckCircle2 },
  failed: { label: "Failed", variant: "danger", icon: XCircle },
};

export function StatusPill({ status }: { status: StageStatus }) {
  const config = statusMap[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-2">
      <Icon className={`h-3.5 w-3.5 ${status === "running" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  );
}
