import type { ProgressEvent } from "@/lib/types";

interface StreamHandlers {
  onEvent: (event: ProgressEvent) => void;
}

export async function streamResearch(topic: string, handlers: StreamHandlers) {
  const response = await fetch("/api/research/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok || !response.body) {
    const fallbackMessage =
      response.headers.get("content-type")?.includes("application/json")
        ? ((await response.json()) as { error?: string }).error
        : "The research stream could not be started.";
    throw new Error(fallbackMessage || "The research stream could not be started.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      handlers.onEvent(JSON.parse(trimmed) as ProgressEvent);
    }
  }

  if (buffer.trim()) {
    handlers.onEvent(JSON.parse(buffer) as ProgressEvent);
  }
}
