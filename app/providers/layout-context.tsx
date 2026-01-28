"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/layout/NavBar"
import FloatingSocialIcons from "@/components/layout/floating-social-media"
import Footer from "@/components/layout/Footer"
import { CameraCursorProvider } from "@/components/camera-cursor-provider"

export function PublicLayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <CameraCursorProvider>
      <Navigation />
      <FloatingSocialIcons />
      {children}
      <footer>
        <Footer />
      </footer>
    </CameraCursorProvider>
  )
}