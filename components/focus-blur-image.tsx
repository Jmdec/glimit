"use client"
import { motion } from "framer-motion"
import Image from "next/image"

interface FocusBlurImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  delay?: number
  className?: string
}

export function FocusBlurImage({
  src,
  alt,
  width = 400,
  height = 500,
  delay = 0,
  className = "",
}: FocusBlurImageProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div
        className="absolute inset-0"
        variants={{
          hidden: { filter: "blur(20px)", scale: 1.1 },
          visible: { filter: "blur(0px)", scale: 1 },
        }}
        transition={{
          delay,
          duration: 1.2,
          ease: "easeOut",
        }}
      >
        <Image src={src || "/placeholder.svg"} alt={alt} fill sizes="w-full h-full" className="object-cover" />
      </motion.div>

      {/* Auto-focus brackets that appear then fade */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: [0, 1, 1, 0] },
        }}
        transition={{
          delay,
          duration: 1.5,
          times: [0, 0.2, 0.7, 1],
        }}
      >
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary" />
          <motion.div
            className="absolute inset-2 border border-primary/50"
            variants={{
              hidden: { scale: 1.5, opacity: 0 },
              visible: { scale: 1, opacity: [0, 1, 0] },
            }}
            transition={{ delay: delay + 0.3, duration: 0.8 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
