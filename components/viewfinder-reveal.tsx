"use client"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ViewfinderRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function ViewfinderReveal({ children, delay = 0, className = "" }: ViewfinderRevealProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}

      {/* Viewfinder frame that animates in */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ delay, duration: 0.3 }}
      >
        {/* Corner brackets that expand */}
        <motion.div
          className="absolute top-0 left-0 border-l-2 border-t-2 border-primary"
          variants={{
            hidden: { width: 0, height: 0 },
            visible: { width: 40, height: 40 },
          }}
          transition={{ delay: delay + 0.2, duration: 0.4, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-0 right-0 border-r-2 border-t-2 border-primary"
          variants={{
            hidden: { width: 0, height: 0 },
            visible: { width: 40, height: 40 },
          }}
          transition={{ delay: delay + 0.3, duration: 0.4, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 border-l-2 border-b-2 border-primary"
          variants={{
            hidden: { width: 0, height: 0 },
            visible: { width: 40, height: 40 },
          }}
          transition={{ delay: delay + 0.4, duration: 0.4, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 border-r-2 border-b-2 border-primary"
          variants={{
            hidden: { width: 0, height: 0 },
            visible: { width: 40, height: 40 },
          }}
          transition={{ delay: delay + 0.5, duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>

      {/* Focus animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        variants={{
          hidden: { opacity: 1 },
          visible: { opacity: 0 },
        }}
        transition={{ delay: delay + 0.8, duration: 0.3 }}
      >
        <motion.div
          className="w-20 h-20 border-2 border-primary/60 rounded-full"
          variants={{
            hidden: { scale: 2, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          }}
          transition={{ delay: delay + 0.2, duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  )
}
