import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const params = url.searchParams

    const approved = params.get("approved")
    const status = params.get("status")
    const search = params.get("search")
    const sortBy = params.get("sortBy") || "date"
    const sortOrder = params.get("sortOrder") || "asc"
    const pageSize = params.get("pageSize") || "10"
    const page = params.get("page") || "1"

    // Get the token from cookies (httpOnly)
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let apiUrl: string

    // If no query params at all → fetch all
    if (!approved && !status && !search && !params.get("page") && !params.get("pageSize")) {
      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/bookings?all=true`
    } else {
      // otherwise build paginated query
      const query = new URLSearchParams()
      if (approved) query.append("approved", approved)
      if (status) query.append("status", status)
      if (search) query.append("search", search)
      query.append("sortBy", sortBy)
      query.append("sortOrder", sortOrder)
      query.append("pageSize", pageSize)
      query.append("page", page)

      apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/bookings?${query.toString()}`
    }

    // Call your Laravel API
    const res = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ message: data.message || "Error fetching bookings" }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const cookieStore = await cookies()

    const token = cookieStore.get("admin_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Map frontend fields to Laravel’s expected schema
    const payload = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      serviceType: body.serviceType,
      date: body.date,
      time: body.time,
      guests: body.guests,
      status: body.status,
      message: body.message,
      approved: body.approved ?? false,
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error("Route error:", err)
    return NextResponse.json({ message: "Failed to create booking" }, { status: 500 })
  }
}
