import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/testimonials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    const contentType = res.headers.get("content-type")
    const data = contentType && contentType.includes("application/json") ? await res.json() : await res.text()

    if (!res.ok) {
      console.error("Laravel error response:", data)

      return NextResponse.json(
        {
          message: "Failed to update testimonial",
          error: data,
        },
        { status: res.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin testimonial PUT error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const contentType = res.headers.get("content-type")
    const data = contentType && contentType.includes("application/json") ? await res.json() : await res.text()

    if (!res.ok) {
      console.error("Laravel delete error:", data)

      return NextResponse.json(
        {
          message: "Failed to delete testimonial",
          error: data,
        },
        { status: res.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin testimonial DELETE error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
