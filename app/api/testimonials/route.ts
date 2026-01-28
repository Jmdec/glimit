import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Submission failed", errors: data.errors }, { status: response.status })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Testimonial submit error:", error)

    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, {
      cache: "no-store",
    })

    const contentType = res.headers.get("content-type")
    const data = contentType && contentType.includes("application/json") ? await res.json() : await res.text()

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch testimonials", data }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Testimonials API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
