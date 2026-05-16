"use client";

import { useEffect, useState } from "react";

export function TypingText({
  text,
  speed = 10,
  active = true,
}: {
  text: string;
  speed?: number;
  active?: boolean;
}) {
  const [visibleText, setVisibleText] = useState(active ? "" : text);

  useEffect(() => {
    if (!active) {
      setVisibleText(text);
      return;
    }

    setVisibleText("");
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [active, speed, text]);

  return (
    <div className="relative">
      <pre className="whitespace-pre-wrap font-body text-sm leading-7 text-slate-200">{visibleText}</pre>
      {active ? <span className="absolute bottom-0 ml-1 inline-block h-5 w-[2px] animate-pulse bg-cyan-300" /> : null}
    </div>
  );
}
