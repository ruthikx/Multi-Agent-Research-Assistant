import { NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  const body = await request.text();

  try {
    const response = await fetch(`${backendUrl}/research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
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
