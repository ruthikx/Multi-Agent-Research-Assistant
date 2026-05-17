import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-[52px] w-full rounded-xl border border-white/10 bg-[#161b27] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/15",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
