import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-[52px] w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--accent)/0.6)] focus:ring-4 focus:ring-[hsl(var(--accent)/0.15)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
