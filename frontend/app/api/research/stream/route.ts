import { NextResponse } from "next/server";
export const maxDuration = 60;
const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  const body = await request.text();

  try {
    const response = await fetch(`${backendUrl}/research/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });

    if (!response.ok || !response.body) {
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("content-type") || "application/json",
        },
      });
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The frontend could not reach the FastAPI backend.",
      },
      { status: 500 }
    );
  }
}
