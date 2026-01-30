"use client"

import { useIsMobile, useIsTablet } from "@/hooks/use-device"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000"

interface HexCell {
  id: number
  image: FilmStripImage
  x: number
  y: number
  index: number
}

export function HoneycombGridGallery() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/film-strip?perPage=1000")
      .then((res) => res.json())
      .then((json) => setGalleryImages(json.data || json))
      .finally(() => setLoading(false))
  }, [])

  const hexSize = isMobile ? 70 : 100
  const hexWidth = hexSize * 2
  const hexHeight = Math.sqrt(3) * hexSize
  const hSpacing = hexWidth * 0.75
  const vSpacing = hexHeight

  const cols = isMobile ? 2 : isTablet ? 4 : 6

  const cells: HexCell[] = galleryImages.map((image, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    const xOffset = row % 2 ? hSpacing +4 / 2 : 0

    return {
      id: image.id,
      image,
      index,
      x: col * hSpacing + xOffset,
      y: row * vSpacing,
    }
  })

  const maxX = cols * hSpacing + hSpacing
  const maxY = Math.ceil(galleryImages.length / cols) * vSpacing + hexHeight

  const hexagonClipPath =
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"

  if (loading) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center text-yellow-400">
        Loading honeycomb…
      </section>
    )
  }

  return (
    <section className="bg-black overflow-x-hidden">
      <div className="flex justify-center overflow-hidden">
        <div
          className="relative"
          style={{
            width: maxX,
            height: maxY,
          }}
        >
          {cells.map((cell) => (
            <motion.div
              key={cell.id}
              className="absolute"
              style={{
                left: cell.x,
                top: cell.y,
                width: hexSize * 2,
                height: hexSize * 2,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: cell.index * 0.02,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <div
                className="relative w-full h-full overflow-hidden"
                style={{ clipPath: hexagonClipPath }}
              >
                <Image
                  src={
                    cell.image.image_path.startsWith("http")
                      ? cell.image.image_path
                      : `${API_IMG}/${cell.image.image_path.replace(/^\//, "")}`
                  }
                  alt={cell.image.alt_text || ""}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="200px"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}