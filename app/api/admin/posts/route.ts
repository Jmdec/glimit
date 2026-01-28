import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const params = url.searchParams

    const search = params.get("search")
    const page = params.get("page") || "1"
    const perPage = params.get("perPage") || "10"
    const sortBy = params.get("sortBy") || "date"
    const sortOrder = params.get("sortOrder") || "desc"

    const query = new URLSearchParams()
    if (search) query.append("search", search)
    query.append("page", page)
    query.append("perPage", perPage)
    query.append("sortBy", sortBy)
    query.append("sortOrder", sortOrder)

    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ message: data.message || "Error fetching posts" }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ message: data.message || "Error creating post" }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
