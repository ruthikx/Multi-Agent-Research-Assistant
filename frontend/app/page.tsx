import { cookies } from "next/headers";

import { ResearchWorkspace } from "@/components/research-workspace";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lastTopic = cookieStore.get("last-topic")?.value;

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-8 lg:py-8">
        <ResearchWorkspace initialTopic={lastTopic} />
      </div>
    </main>
  );
}
