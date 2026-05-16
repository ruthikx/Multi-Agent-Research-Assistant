"use server";

import { cookies } from "next/headers";

export async function saveLastTopicAction(topic: string) {
  const cookieStore = await cookies();
  cookieStore.set("last-topic", topic, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
