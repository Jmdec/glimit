"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

interface GalleryItem {
  src: string
  alt: string
}

interface HorizontalGalleryProps {
  images: GalleryItem[]
  className?: string
}

export function HorizontalGallery({ images, className = "" }: HorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"])

  return (
    <div ref={containerRef} className={`overflow-hidden py-8 ${className}`}>
      <motion.div className="flex gap-6 px-8 md:px-16" style={{ x }}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative flex-shrink-0 w-72 h-96 md:w-80 md:h-[28rem] overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Camera shutter reveal effect */}
            <motion.div
              className="absolute inset-0 z-10 bg-black"
              initial={{ scaleY: 1 }}
              whileInView={{ scaleY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.4, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
            <motion.div
              className="absolute inset-0 z-10 bg-black"
              initial={{ scaleY: 1 }}
              whileInView={{ scaleY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.4, ease: "easeInOut" }}
              style={{ transformOrigin: "bottom" }}
            />

            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              sizes="w-full h-full"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Viewfinder overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/80" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/80" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/80" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/80" />
              {/* Center focus point */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12">
                <div className="absolute inset-0 border border-white/60 rounded-full" />
                <div className="absolute inset-3 border border-white/60 rounded-full" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/40" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-white/40" />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
