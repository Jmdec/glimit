// middleware.ts (in the root of your project)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if it's an admin route (but not the login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_token")
    
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin_token")
    
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}