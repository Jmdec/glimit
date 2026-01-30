"use client"

import { useEffect, useState, memo, useCallback, useRef } from "react"
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
const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

const perforations = Array.from({ length: 5 }, (_, i) => i)

// Individual Image
const FilmStripImageItem = memo(
  ({ image, isLast, active, onLoad }: { image: FilmStripImage; isLast: boolean; active: boolean; onLoad?: () => void }) => {
    const [loaded, setLoaded] = useState(false)

    const getImageUrl = useCallback((path: string) => {
      if (!path) return "/placeholder.png"
      if (path.startsWith("http")) return path
      const cleanPath = path.startsWith("/") ? path.slice(1) : path
      return `${API_IMG}/${cleanPath}`
    }, [])

    return (
      <div
        className={`relative flex-shrink-0 w-64 h-64 bg-gray-900 border-4 border-gray-800 overflow-hidden ${!isLast ? "mr-2" : ""}`}
        style={{
          animation: active && !prefersReducedMotion ? `filmFloat ${6 + (image.id % 4)}s ease-in-out infinite` : "none",
        }}
      >
        {!loaded && <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />}

        <Image
          src={getImageUrl(image.image_path)}
          alt={image.alt_text || ""}
          width={256}
          height={256}
          className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => {
            setLoaded(true)
            onLoad?.()
          }}
          loading="lazy"
        />
      </div>
    )
  },
)

FilmStripImageItem.displayName = "FilmStripImageItem"

// Film Strip Row
const FilmStripRow = memo(
  ({ images, reverse = false, speed = 10, rowIndex }: { images: FilmStripImage[]; reverse?: boolean; speed?: number; rowIndex: number }) => {
    const rowRef = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState(0)
    const [playMarquee, setPlayMarquee] = useState(false)

    // Start marquee after a small delay to ensure DOM is rendered
    useEffect(() => {
      const timeout = setTimeout(() => {
        setPlayMarquee(true)
      }, 100) // 100ms delay; adjust if needed
      return () => clearTimeout(timeout)
    }, [])

    // Scroll offset logic
    useEffect(() => {
      let ticking = false
      const onScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(() => {
          if (!rowRef.current) return
          const rect = rowRef.current.getBoundingClientRect()
          const viewportCenter = window.innerHeight / 2
          const distance = rect.top - viewportCenter
          const intensity = 0.01 + rowIndex * 0.015
          setOffset(-distance * intensity)
          ticking = false
        })
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener("scroll", onScroll)
    }, [rowIndex])

    return (
      <div
        ref={rowRef}
        className={`relative ${reverse ? "-rotate-2" : "rotate-2"} my-8`}
        style={{
          transform: `translateY(${offset}px)`,
          transition: "transform 0.25s linear",
          animation: "fadeInSoft 1.2s ease-out both",
          willChange: "transform",
        }}
      >
        <div className="relative bg-black border-y-8 border-black py-4 overflow-hidden">
          <div className="relative h-64">
            <Marquee
              gradient={false}
              speed={speed}
              direction={reverse ? "right" : "left"}
              play={playMarquee} // always true after delay
            >
              {images.map((img, index) => (
                <FilmStripImageItem key={img.id} image={img} isLast={index === images.length - 1} active={playMarquee} />
              ))}
            </Marquee>
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rotate-90 z-20">G-LIMIT</div>
      </div>
    )
  },
)

FilmStripRow.displayName = "FilmStripRow"

// Skeleton
const FilmStripSkeletonRow = ({ reverse = false }: { reverse?: boolean }) => (
  <div className={`my-8 ${reverse ? "-rotate-2" : "rotate-2"}`}>
    <div className="relative bg-black border-y-8 border-black py-4 overflow-hidden">
      <div className="relative h-64 flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-64 h-64 mr-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse border-4 border-gray-800" />
        ))}
      </div>
    </div>
  </div>
)

// Gallery
export function FilmStripGallery() {
  const [rowImages, setRowImages] = useState<FilmStripImage[][]>([[], [], []])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/film-strip?perPage=26")
        const json = await res.json()
        const images: FilmStripImage[] = Array.isArray(json.data) ? json.data : []

        setRowImages([images.slice(0, 9), images.slice(9, 18), images.slice(18, 27)])
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
        <>
          <FilmStripSkeletonRow />
          <FilmStripSkeletonRow reverse />
          <FilmStripSkeletonRow />
        </>
      ) : (
        rowImages.map((images, i) => <FilmStripRow key={i} images={images} reverse={i % 2 === 1} speed={[20, 30, 15][i]} rowIndex={i} />)
      )}
    </section>
  )
}

;<style jsx global>{`
  @keyframes filmFloat {
    0% {
      transform: translateY(0px) translateZ(0);
    }
    50% {
      transform: translateY(-3px) translateZ(0);
    }
    100% {
      transform: translateY(0px) translateZ(0);
    }
  }

  @keyframes fadeInSoft {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`}</style>
