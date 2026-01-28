"use client"
import { motion } from "framer-motion"
import type React from "react"

import { useRef } from "react"

interface ApertureRevealProps {
  children: React.ReactNode
  delay?: number
}

export function ApertureReveal({ children, delay = 0 }: ApertureRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay }}
    >
      {/* Aperture blades animation */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, delay: delay + 0.3 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-foreground origin-center"
            style={{
              width: "150%",
              height: "150%",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
            }}
            initial={{ scale: 1 }}
            whileInView={{ scale: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.8,
              delay: delay + 0.2 + i * 0.05,
              ease: [0.32, 0.72, 0, 1],
            }}
          />
        ))}
      </motion.div>

      {/* Content with scale animation */}
      <motion.div
        initial={{ scale: 1.1, filter: "blur(10px)" }}
        whileInView={{ scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, delay: delay + 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
