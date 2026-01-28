import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Posts API error:", res.status, errorText)
      return new Response(JSON.stringify({ error: errorText }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Unexpected error:", err)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
