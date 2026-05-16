import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { ResearchWorkspace } from "@/components/research-workspace";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lastTopic = cookieStore.get("last-topic")?.value;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.22),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_60%)]" />
      <div className="absolute inset-0 bg-grid-fade bg-[size:64px_64px] opacity-[0.05]" />
      <div className="relative mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <AppSidebar lastTopic={lastTopic} />
        <ResearchWorkspace initialTopic={lastTopic} />
      </div>
    </main>
  );
}
