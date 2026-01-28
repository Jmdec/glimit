"use client"
import { motion } from "framer-motion"

interface ShutterTextProps {
  text: string
  className?: string
  delay?: number
}

export function ShutterText({ text, className = "", delay = 0 }: ShutterTextProps) {
  const words = text.split(" ")

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: delay + wordIndex * 0.08,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
