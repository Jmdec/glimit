"use client"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FlashRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FlashReveal({ children, delay = 0, className = "" }: FlashRevealProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Flash overlay */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none z-10"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: [0, 1, 0] },
        }}
        transition={{
          delay,
          duration: 0.6,
          times: [0, 0.1, 1],
          ease: "easeOut",
        }}
      />

      {/* Content fades in after flash */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 1.05 },
          visible: { opacity: 1, scale: 1 },
        }}
        transition={{ delay: delay + 0.15, duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
