"use client"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GeometricFrameProps {
  children: ReactNode
  className?: string
  accentColor?: string
  delay?: number
}

export function GeometricFrame({
  children,
  className = "",
  accentColor = "border-gold",
  delay = 0,
}: GeometricFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Top-left L-shaped corner */}
      <motion.div
        className={`absolute -top-3 -left-3 w-12 h-12 border-l-2 border-t-2 ${accentColor} z-10 pointer-events-none`}
        initial={{ opacity: 0, x: -10, y: -10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
      />

      {/* Bottom-right L-shaped corner */}
      <motion.div
        className={`absolute -bottom-3 -right-3 w-12 h-12 border-r-2 border-b-2 ${accentColor} z-10 pointer-events-none`}
        initial={{ opacity: 0, x: 10, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
      />

      {/* Small decorative square */}
      <motion.div
        className="absolute -bottom-6 -left-6 w-4 h-4 border border-white/30 z-10 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.4, duration: 0.3 }}
      />

      {children}
    </div>
  )
}
