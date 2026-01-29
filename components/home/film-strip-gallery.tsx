"use client"

import { useEffect, useState, memo, useCallback } from "react"
import Image from "next/image"
import Marquee from "react-fast-marquee"
import { useInView } from "react-intersection-observer"

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

const FilmStripImageItem = memo(({ image, rowIndex }: { image: FilmStripImage; rowIndex: number }) => {
  const getImageUrl = useCallback((path: string) => {
    if (!path) return "/placeholder.png"
    if (path.startsWith("http")) return path
    const cleanPath = path.startsWith("/") ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }, [])

  return (
    <div className="relative flex-shrink-0 w-64 h-64 bg-gray-900 border-4 border-gray-800 mr-2 overflow-hidden">
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

const FilmStripRow = memo(
  ({ images, reverse = false, speed = 10, rowIndex }: { images: FilmStripImage[]; reverse?: boolean; speed?: number; rowIndex: number }) => (
    <div className={`relative ${reverse ? "-rotate-2" : "rotate-2"} my-8`}>
      <div className="relative bg-black border-y-8 border-black py-4 overflow-hidden">
        {/* Top & Bottom perforations */}
        <div className="absolute top-0 left-0 right-0 flex justify-around px-4 z-10">
          {perforations.map((i) => (
            <div key={i} className="w-4 h-6 bg-white rounded-sm" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 z-10">
          {perforations.map((i) => (
            <div key={i} className="w-4 h-6 bg-white rounded-sm" />
          ))}
        </div>

        <div className="relative h-64">
          <Marquee gradient={false} speed={speed} direction={reverse ? "right" : "left"}>
            {images.map((img) => (
              <FilmStripImageItem key={img.id} image={img} rowIndex={rowIndex} />
            ))}
          </Marquee>
        </div>
      </div>

      <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rotate-90 z-20">G-LIMIT</div>
    </div>
  ),
)
FilmStripRow.displayName = "FilmStripRow"

export function FilmStripGallery() {
  const [rowImages, setRowImages] = useState<FilmStripImage[][]>([[], [], []])
  const [loadingRows, setLoadingRows] = useState([true, true, true])

  const rowRefs = Array(3)
    .fill(0)
    .map(() => useInView({ triggerOnce: true, rootMargin: "300px" }))

  const fetchRow = useCallback(async (page: number, rowIndex: number) => {
    try {
      const res = await fetch(`/api/film-strip?perPage=7&page=${page}`)
      const json = await res.json()
      const images = Array.isArray(json.data) ? json.data : []
      setRowImages((prev) => prev.map((row, i) => (i === rowIndex ? images : row)))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingRows((prev) => prev.map((l, i) => (i === rowIndex ? false : l)))
    }
  }, [])

  useEffect(() => {
    fetchRow(1, 0)
  }, [fetchRow])

  rowRefs.forEach(([ref, inView], idx) => {
    useEffect(() => {
      if (inView && loadingRows[idx]) fetchRow(idx + 1, idx)
    }, [inView, idx])
  })

  return (
    <section className="py-16 bg-gradient-to-b from-amber-900/40 via-amber-950/60 to-black overflow-hidden min-h-screen space-y-4">
      {rowImages.map((images, i) => (
        <div key={i} ref={rowRefs[i][0]}>
          {loadingRows[i] ? (
            <div className="text-[#d4a574] text-center">Loading Row {i + 1}...</div>
          ) : (
            <FilmStripRow images={images} reverse={i % 2 === 1} speed={[20, 30, 15][i]} rowIndex={i} />
          )}
        </div>
      ))}
    </section>
  )
}
