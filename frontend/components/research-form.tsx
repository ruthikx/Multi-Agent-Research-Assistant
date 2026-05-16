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
    <form onSubmit={handleSubmit} className="rounded-[30px] border border-white/10 bg-black/30 p-3 backdrop-blur-xl">
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Ask the research team about AI regulation, market trends, startup landscapes..."
          className="h-14 flex-1 rounded-[22px] border-white/5 bg-slate-950/80 text-base"
        />
        <Button type="submit" size="lg" className="h-14 rounded-[22px] px-6" disabled={loading}>
          {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
          {loading ? "Researching" : "Start Research"}
        </Button>
      </div>
    </form>
  );
}
