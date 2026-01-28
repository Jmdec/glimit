"use client"
import { useEffect } from "react"
import type React from "react"

export function CameraCursorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("camera-cursor")

    // Add pointer cursor class to interactive elements
    const interactiveElements = document.querySelectorAll("a, button, [role='button'], input, select, textarea")
    interactiveElements.forEach((el) => {
      el.classList.add("camera-cursor-pointer")
    })

    return () => {
      document.body.classList.remove("camera-cursor")
    }
  }, [])

  return <>{children}</>
}
