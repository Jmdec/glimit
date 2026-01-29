"use client"
import { useIsMobile, useIsTablet } from "@/hooks/use-device"
import { motion, useMotionValue, useTransform } from "framer-motion"
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

interface FloatingPanel {
  id: number
  image: FilmStripImage
  index: number
}

export function FloatingPanelsGallery() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [panels, setPanels] = useState<FloatingPanel[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragStart, setDragStart] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
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

  // Create panels
  useEffect(() => {
    if (galleryImages.length === 0) return

    const floatingPanels: FloatingPanel[] = galleryImages.map((image, index) => ({
      id: image.id,
      image,
      index,
    }))

    setPanels(floatingPanels)
  }, [galleryImages])

  // Keyboard navigation
  useEffect(() => {
    if (!isMounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setCurrentIndex(prev => Math.min(prev + 1, panels.length - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setCurrentIndex(prev => Math.max(prev - 1, 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMounted, panels.length])

  // Mouse wheel navigation
  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return

    let wheelTimeout: NodeJS.Timeout
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          setCurrentIndex(prev => Math.min(prev + 1, panels.length - 1))
        } else if (e.deltaY < 0) {
          setCurrentIndex(prev => Math.max(prev - 1, 0))
        }
      }, 50)
    }

    const element = scrollContainerRef.current
    element.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      element.removeEventListener('wheel', handleWheel)
      clearTimeout(wheelTimeout)
    }
  }, [isMounted, panels.length])

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  const handlePanelClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, panels.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  if (!isMounted || loading) {
    return (
      <section className="bg-white overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-slate-800 text-lg font-light">
          {loading ? 'Loading panels...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="bg-white overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-slate-800 text-lg font-light">No images available</div>
      </section>
    )
  }

  const visibleRange = isMobile ? 2 : 3 // How many panels to show before/after current

  return (
    <section 
      ref={scrollContainerRef}
      className="relative bg-white overflow-hidden h-screen"
    >
      {/* Main panel container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
      >
        {panels.map((panel, index) => {
          const offset = index - currentIndex
          const isVisible = Math.abs(offset) <= visibleRange
          
          if (!isVisible) return null

          // Calculate position and scale
          const isCurrent = offset === 0
          const scale = isCurrent ? 1 : 0.85 - Math.abs(offset) * 0.05
          const x = offset * (isMobile ? 85 : 70) // Percentage
          const y = Math.abs(offset) * 3 // Slight vertical offset
          const z = -Math.abs(offset) * 100 // Depth
          const opacity = isCurrent ? 1 : 0.4 - Math.abs(offset) * 0.1
          const blur = isCurrent ? 0 : Math.abs(offset) * 2

          // Panel dimensions
          const panelWidth = isMobile ? '85vw' : '50vw'
          const panelHeight = isMobile ? '70vh' : '75vh'

          return (
            <motion.div
              key={panel.id}
              className="absolute cursor-pointer"
              style={{
                width: panelWidth,
                height: panelHeight,
                zIndex: 100 - Math.abs(offset),
              }}
              animate={{
                x: `${x}%`,
                y: `${y}%`,
                scale,
                opacity,
                rotateY: offset * -5,
                filter: `blur(${blur}px)`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onClick={() => !isCurrent && handlePanelClick(index)}
            >
              {/* Card container */}
              <div 
                className="relative w-full h-full bg-white rounded-2xl overflow-hidden"
                style={{
                  boxShadow: isCurrent 
                    ? '0 25px 60px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.1)'
                    : '0 15px 40px rgba(0,0,0,0.1)',
                }}
              >
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={getImageUrl(panel.image.image_path) || "/placeholder.png"}
                    alt={panel.image.alt_text || `Panel ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 85vw, 50vw"
                    className="object-cover"
                    loading={Math.abs(offset) <= 1 ? "eager" : "lazy"}
                    priority={Math.abs(offset) <= 1}
                  />
                  
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                </div>

                {/* Info panel at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-light mb-1">
                        {panel.image.alt_text || `Image ${index + 1}`}
                      </h3>
                      <p className="text-sm text-white/80">
                        {index + 1} of {panels.length}
                      </p>
                    </div>
                    
                    {isCurrent && (
                      <motion.button
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-light hover:bg-white/30 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          // Could open full view or download
                        }}
                      >
                        View Details
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Border accent when current */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 border-2 border-slate-900/10 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <motion.button
          className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors z-50"
          onClick={handlePrev}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {currentIndex < panels.length - 1 && (
        <motion.button
          className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors z-50"
          onClick={handleNext}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          {panels.slice(0, Math.min(panels.length, 50)).map((panel, index) => (
            <button
              key={panel.id}
              className="relative"
              onClick={() => setCurrentIndex(index)}
            >
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-slate-800 w-8' 
                    : index < currentIndex
                    ? 'bg-slate-400'
                    : 'bg-slate-300'
                }`}
              />
            </button>
          ))}
          {panels.length > 50 && (
            <span className="text-xs text-slate-600 ml-2">+{panels.length - 50}</span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <motion.div 
        className="absolute top-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <p className="text-slate-600 text-sm font-light">
            {isMobile ? 'Tap cards • Swipe to navigate' : 'Click cards • Use arrow keys or scroll'}
          </p>
        </div>
      </motion.div>

      {/* Photo counter */}
      <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-50">
        <p className="text-slate-800 text-sm font-medium">
          {currentIndex + 1} / {panels.length}
        </p>
      </div>
    </section>
  )
}