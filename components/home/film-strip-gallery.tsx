"use client"

import { useEffect, useState, memo, useCallback } from "react"
import Image from "next/image"
import Marquee from "react-fast-marquee"

interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000"

// Precompute perforation slots
const perforations = Array.from({ length: 5 }, (_, i) => i)

const FilmStripImageItem = memo(({ image, rowIndex, isLast }: { image: FilmStripImage; rowIndex: number; isLast: boolean }) => {
  const getImageUrl = useCallback((path: string) => {
    if (!path) return "/placeholder.png"
    if (path.startsWith("http")) return path
    const cleanPath = path.startsWith("/") ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }, [])

  return (
    <div className={`relative flex-shrink-0 w-64 h-64 bg-gray-900 border-4 border-gray-800 overflow-hidden ${!isLast ? "mr-2" : ""}`}>
      <Image
        src={getImageUrl(image.image_path)}
        alt={image.alt_text || ""}
        width={256}
        height={256}
        style={{ objectFit: "cover" }}
        placeholder="blur"
        blurDataURL="/placeholder.png"
        priority={rowIndex === 0}
        loading={rowIndex === 0 ? "eager" : "lazy"}
      />
      <div className="absolute top-2 left-2 text-yellow-500 font-mono text-xs font-bold">{String(image.id).padStart(3, "0")}</div>
    </div>
  )
})

FilmStripImageItem.displayName = "FilmStripImageItem"

// Film Strip Row
const FilmStripRow = memo(
  ({ images, reverse = false, speed = 10, rowIndex }: { images: FilmStripImage[]; reverse?: boolean; speed?: number; rowIndex: number }) => (
    <div className={`relative ${reverse ? "-rotate-2" : "rotate-2"} my-8`}>
      <div className="relative bg-black border-y-8 border-black py-4 overflow-hidden">
        {/* Top perforations */}
        <div className="absolute top-0 left-0 right-0 flex justify-around px-4 z-10">
          {perforations.map((i) => (
            <div key={i} className="w-4 h-6 bg-white rounded-sm" />
          ))}
        </div>

        {/* Bottom perforations */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 z-10">
          {perforations.map((i) => (
            <div key={i} className="w-4 h-6 bg-white rounded-sm" />
          ))}
        </div>

        <div className="relative h-64">
          <Marquee gradient={false} speed={speed} direction={reverse ? "right" : "left"}>
            {images.map((img, index) => (
              <FilmStripImageItem key={img.id} image={img} rowIndex={rowIndex} isLast={index === images.length - 1} />
            ))}
          </Marquee>
        </div>
      </div>

      <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rotate-90 z-20">G-LIMIT</div>
    </div>
  ),
)

FilmStripRow.displayName = "FilmStripRow"

//  Film Strip Gallery
export function FilmStripGallery() {
  const [rowImages, setRowImages] = useState<FilmStripImage[][]>([[], [], []])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/film-strip?perPage=25")
        const json = await res.json()
        const images: FilmStripImage[] = Array.isArray(json.data) ? json.data : []

        setRowImages([images.slice(0, 8), images.slice(9, 17), images.slice(18, 25)])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-amber-900/40 via-amber-950/60 to-black overflow-hidden min-h-screen space-y-4">
      {loading ? (
        <div className="text-[#d4a574] text-center">Loading Gallery...</div>
      ) : (
        rowImages.map((images, i) => <FilmStripRow key={i} images={images} reverse={i % 2 === 1} speed={[20, 30, 15][i]} rowIndex={i} />)
      )}
    </section>
  )
}
