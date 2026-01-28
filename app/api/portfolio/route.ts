import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const url = category ? `${API_URL}/portfolio?category=${category}` : `${API_URL}/portfolio`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("[v0] Portfolio GET error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch portfolio items",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${API_URL}/portfolio`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("[v0] Portfolio POST error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create portfolio item",
      },
      { status: 500 }
    );
  }
}
