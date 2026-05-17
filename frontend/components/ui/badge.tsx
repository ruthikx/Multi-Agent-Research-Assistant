import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.02em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-[hsl(var(--accent)/0.2)] bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]",
        muted: "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--panel-foreground))]",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
        danger: "border-rose-500/20 bg-rose-500/10 text-rose-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
