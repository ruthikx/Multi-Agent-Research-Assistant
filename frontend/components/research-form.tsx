"use client";

import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResearchForm({
  onSubmit,
  loading,
  initialTopic,
}: {
  onSubmit: (topic: string) => void;
  loading: boolean;
  initialTopic?: string;
}) {
  const [topic, setTopic] = useState(initialTopic || "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanedTopic = topic.trim();
    if (!cleanedTopic || loading) return;
    onSubmit(cleanedTopic);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-[#161b27] p-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Input
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Ask the research team about AI regulation, market trends, startup landscapes..."
          className="h-[52px] flex-1 border-transparent bg-transparent px-4 text-base focus:bg-[#161b27]"
        />
        <Button type="submit" size="lg" className="shrink-0 rounded-lg px-5 md:min-w-[170px]" disabled={loading}>
          {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
          {loading ? "Researching" : "Start Research"}
        </Button>
      </div>
    </form>
  );
}
