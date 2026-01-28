// app/api/admin/login/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("🔵 API Route: Login request received")
  
  try {
    const body = await req.json()
    console.log("📧 Email from request:", body.email)
    console.log("🔐 Password received:", body.password ? "Yes" : "No")
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`
    console.log("🌐 Backend URL:", apiUrl)

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("📡 Backend response status:", res.status)

    const data = await res.json()
    console.log("📦 Backend response data:", data)

    if (!res.ok) {
      console.error("❌ Backend error:", data.message)
      return NextResponse.json(
        { message: data.message || "Login failed" }, 
        { status: res.status }
      )
    }

    console.log("✅ Login successful, setting cookie")
    console.log("🔑 Token received:", data.token ? "Yes" : "No")

    // Create response
    const response = NextResponse.json({
      success: true,
      user: data.user,
    })

    // Set secure httpOnly cookie
    response.cookies.set("admin_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    })

    console.log("🍪 Cookie set successfully")

    return response
  } catch (error) {
    console.error("💥 API Route Error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" }, 
      { status: 500 }
    )
  }
}