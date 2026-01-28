import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    const approved = searchParams.get("approved")
    const rating = searchParams.get("rating")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") ?? "created_at"
    const sortOrder = searchParams.get("sortOrder") ?? "desc"
    const perPage = searchParams.get("perPage") ?? "10"
    const page = searchParams.get("page") ?? "1"

    const params = new URLSearchParams()
    params.set("sortBy", sortBy)
    params.set("sortOrder", sortOrder)
    params.set("perPage", perPage)
    params.set("page", page)

    if (approved !== null) params.set("approved", approved)
    if (rating) params.set("rating", rating)
    if (search) params.set("search", search)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/testimonials?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch testimonials", data }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin testimonials GET error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/testimonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        name: body.name,
        title: body.title ?? null,
        rating: body.rating,
        message: body.message,
        approved: body.approved ?? false,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to create testimonial", data }, { status: res.status })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Admin testimonials POST error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
