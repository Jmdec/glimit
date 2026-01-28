import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const contentType = res.headers.get("content-type")
    const data = contentType && contentType.includes("application/json") ? await res.json() : await res.text()

    if (!res.ok) {
      console.error("Laravel dashboard error:", data)
      return NextResponse.json({ message: "Failed to fetch dashboard", error: data }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin dashboard API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
