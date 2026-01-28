"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

interface LensFocusImageProps {
  src: string
  alt: string
  className?: string
}

export function LensFocusImage({ src, alt, className = "" }: LensFocusImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [8, 2, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1])

  return (
    <motion.div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          scale,
          filter: blur.get() > 0 ? `blur(${blur.get()}px)` : "none",
        }}
        className="w-full h-full"
      >
        <Image src={src || "/placeholder.svg"} alt={alt} fill sizes="w-full h-full" className="object-cover" />
      </motion.div>

      {/* Focus ring indicator */}
      <motion.div
        className="absolute inset-4 border-2 border-primary/30 pointer-events-none"
        initial={{ opacity: 0, scale: 1.2 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary" />
      </motion.div>
    </motion.div>
  )
}
