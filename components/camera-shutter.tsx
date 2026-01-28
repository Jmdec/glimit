"use client"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface CameraShutterProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function CameraShutter({ children, delay = 0, className = "" }: CameraShutterProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}

      {/* Shutter blades - 8 blade iris effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 bg-foreground"
          initial={{
            clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((i * Math.PI) / 4)}% ${50 + 50 * Math.sin((i * Math.PI) / 4)}%, ${50 + 50 * Math.cos(((i + 1) * Math.PI) / 4)}% ${50 + 50 * Math.sin(((i + 1) * Math.PI) / 4)}%)`,
          }}
          animate={{
            clipPath: "polygon(50% 50%, 50% 50%, 50% 50%)",
          }}
          transition={{
            delay: delay + 0.1 * i,
            duration: 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
