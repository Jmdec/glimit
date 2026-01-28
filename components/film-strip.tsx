"use client"
import { motion } from "framer-motion"
import Image from "next/image"

interface FilmStripProps {
  images: { src: string; alt: string }[]
  direction?: "left" | "right"
  speed?: number
  className?: string
}

export function FilmStrip({ images, direction = "left", speed = 30, className = "" }: FilmStripProps) {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images]

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Film strip frame */}
      <div className="relative bg-foreground py-2">
        {/* Sprocket holes top */}
        <div className="absolute top-0 left-0 right-0 h-3 flex justify-around">
          {[...Array(20)].map((_, i) => (
            <div key={`top-${i}`} className="w-2 h-2 bg-background rounded-sm" />
          ))}
        </div>

        {/* Sprocket holes bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-3 flex justify-around">
          {[...Array(20)].map((_, i) => (
            <div key={`bottom-${i}`} className="w-2 h-2 bg-background rounded-sm" />
          ))}
        </div>

        {/* Film frames */}
        <motion.div
          className="flex gap-1 py-3 px-4"
          animate={{ x: direction === "left" ? "-50%" : "0%" }}
          initial={{ x: direction === "left" ? "0%" : "-50%" }}
          transition={{
            duration: speed,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {duplicatedImages.map((image, index) => (
            <div key={index} className="relative flex-shrink-0 w-32 h-24 md:w-48 md:h-36 bg-black overflow-hidden">
              <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill sizes="w-full h-full" className="object-cover" />
              {/* Film frame border */}
              <div className="absolute inset-0 border border-foreground/30 pointer-events-none" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
