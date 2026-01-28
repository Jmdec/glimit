"use client"
import { useIsMobile, useIsTablet } from "@/hooks/use-device"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"

interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

interface HexCell {
  id: number
  image: FilmStripImage
  row: number
  col: number
  x: number
  y: number
  index: number
}

export function HoneycombGridGallery() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [cells, setCells] = useState<HexCell[]>([])
  const [hoveredCell, setHoveredCell] = useState<number | null>(null)
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/film-strip?perPage=1000', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }

        const json = await response.json()
        const filmStripImages = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
        setGalleryImages(filmStripImages)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Create honeycomb grid layout
  useEffect(() => {
    if (galleryImages.length === 0) return

    // Hexagon dimensions
    const hexSize = isMobile ? 80 : 120 // Radius of hexagon
    const hexWidth = hexSize * 2
    const hexHeight = Math.sqrt(3) * hexSize
    const horizontalSpacing = hexWidth * 0.75 // Overlap for honeycomb
    const verticalSpacing = hexHeight

    // Calculate grid dimensions
    const cols = isMobile ? 4 : 7
    const rows = Math.ceil(galleryImages.length / cols) + 1

    const hexCells: HexCell[] = galleryImages.map((image, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      
      // Offset every other row for honeycomb pattern
      const xOffset = row % 2 === 1 ? horizontalSpacing / 2 : 0
      const x = col * horizontalSpacing + xOffset + hexSize + 20
      const y = row * verticalSpacing + hexSize + 20

      return {
        id: image.id,
        image,
        row,
        col,
        x,
        y,
        index,
      }
    })

    setCells(hexCells)
  }, [galleryImages, isMobile])

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  // Create hexagon clip path
  const hexagonClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"

  if (!isMounted || loading) {
    return (
      <section className="bg-slate-50 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-slate-700 text-lg font-light">
          {loading ? 'Building honeycomb...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="bg-slate-50 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-slate-700 text-lg font-light">No images available</div>
      </section>
    )
  }

  const hexSize = isMobile ? 80 : 120
  const maxX = Math.max(...cells.map(c => c.x)) + hexSize * 2
  const maxY = Math.max(...cells.map(c => c.y)) + hexSize * 2

  return (
    <section 
      ref={scrollContainerRef}
      className="relative bg-slate-50 overflow-auto min-h-screen"
    >
      {/* Honeycomb container */}
      <div 
        className="relative w-full p-8"
        style={{ 
          minHeight: '100vh',
          height: `${maxY}px`,
        }}
      >
        {/* Hexagonal cells */}
        {cells.map((cell) => {
          const isHovered = hoveredCell === cell.id
          const isSelected = selectedCell === cell.id

          return (
            <motion.div
              key={cell.id}
              className="absolute cursor-pointer"
              style={{
                left: cell.x,
                top: cell.y,
                width: hexSize * 2,
                height: hexSize * 2,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: cell.index * 0.015,
              }}
              onHoverStart={() => setHoveredCell(cell.id)}
              onHoverEnd={() => setHoveredCell(null)}
              onClick={() => setSelectedCell(isSelected ? null : cell.id)}
            >
              {/* Hexagon container */}
              <div className="relative w-full h-full">
                {/* Background hexagon (border effect) */}
                <div 
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    clipPath: hexagonClipPath,
                    backgroundColor: isSelected ? '#475569' : isHovered ? '#64748b' : '#cbd5e1',
                    transform: isHovered ? 'scale(1.1)' : isSelected ? 'scale(1.08)' : 'scale(1)',
                  }}
                />

                {/* Image hexagon */}
                <motion.div 
                  className="absolute inset-1 overflow-hidden"
                  style={{
                    clipPath: hexagonClipPath,
                  }}
                  animate={{
                    scale: isHovered ? 1.15 : isSelected ? 1.12 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={getImageUrl(cell.image.image_path) || "/placeholder.svg"}
                      alt={cell.image.alt_text || `Hex ${cell.index + 1}`}
                      fill
                      sizes="(max-width: 768px) 180px, 280px"
                      className="object-cover"
                      loading="lazy"
                    />
                    
                    {/* Overlay on hover/select */}
                    {(isHovered || isSelected) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    {/* Info overlay on hover */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-white text-xs font-medium mb-1 drop-shadow-lg truncate w-full">
                          {cell.image.alt_text || `Image ${cell.index + 1}`}
                        </p>
                        <p className="text-white/80 text-xs drop-shadow-lg">
                          {cell.index + 1} of {cells.length}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      clipPath: hexagonClipPath,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div 
                      className="absolute inset-0 border-4 border-slate-700"
                      style={{
                        clipPath: hexagonClipPath,
                      }}
                    />
                  </motion.div>
                )}

                {/* Hex number badge (bottom corner) */}
                {!isHovered && !isSelected && (
                  <div className="absolute bottom-2 right-2 bg-slate-800/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                    {cell.index + 1}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Info panel */}
      <div className="fixed top-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg z-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div>
            <h3 className="text-slate-800 text-sm font-medium">Honeycomb Grid</h3>
            <p className="text-slate-500 text-xs">{cells.length} hexagons</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <motion.div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-200">
          <p className="text-slate-600 text-sm font-light">
            Hover to preview • Click to select • Scroll to explore
          </p>
        </div>
      </motion.div>

      {/* Selected photo info */}
      {selectedCell && (
        <motion.div 
          className="fixed top-6 right-6 bg-white/95 backdrop-blur-sm px-5 py-4 rounded-xl shadow-lg z-50 border border-slate-200 max-w-xs"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-slate-800 text-sm font-medium">Selected Photo</h4>
            <button 
              onClick={() => setSelectedCell(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {(() => {
            const selected = cells.find(c => c.id === selectedCell)
            if (!selected) return null
            return (
              <>
                <p className="text-slate-600 text-xs mb-3">
                  {selected.image.alt_text || `Image ${selected.index + 1}`}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Position: {selected.index + 1} / {cells.length}</span>
                </div>
              </>
            )
          })()}
        </motion.div>
      )}

      {/* Grid pattern overlay (subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${hexSize * 0.5}px, #475569 ${hexSize * 0.5}px, #475569 ${hexSize * 0.5 + 1}px)`,
          }}
        />
      </div>
    </section>
  )
}