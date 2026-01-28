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

interface RiverNode {
  id: number
  image: FilmStripImage
  x: number
  y: number
  size: number
  rotation: number
  index: number
}

export function FlowingRiverGallery() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [nodes, setNodes] = useState<RiverNode[]>([])
  const [scrollProgress, setScrollProgress] = useState(0)
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

  // Create flowing river layout
  useEffect(() => {
    if (galleryImages.length === 0) return

    const baseSize = isMobile ? 200 : 280
    const amplitude = isMobile ? 150 : 250 // Width of the S-curve
    const frequency = 0.015 // How tight the curves are
    const verticalSpacing = isMobile ? 280 : 350
    
    const riverNodes: RiverNode[] = galleryImages.map((image, index) => {
      // Calculate Y position (flows downward)
      const y = index * verticalSpacing + 100
      
      // Calculate X position using sine wave (creates S-curves)
      const sineWave = Math.sin(index * frequency * Math.PI) * amplitude
      const centerX = isMobile ? 50 : 50 // Center percentage
      const x = centerX + (sineWave / (isMobile ? 4 : 8)) // Convert to percentage
      
      // Alternate size for variety
      const sizeVariation = ((index * 17) % 60) - 30
      const size = baseSize + sizeVariation
      
      // Slight rotation following the curve direction
      const rotation = Math.cos(index * frequency * Math.PI) * 8
      
      return {
        id: image.id,
        image,
        x,
        y,
        size,
        rotation,
        index,
      }
    })

    setNodes(riverNodes)
  }, [galleryImages, isMobile])

  // Track scroll position
  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return

    const handleScroll = () => {
      const element = scrollContainerRef.current
      if (!element) return

      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
      
      setScrollProgress(progress)
    }

    const element = scrollContainerRef.current
    element.addEventListener('scroll', handleScroll)
    
    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [isMounted])

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  if (!isMounted || loading) {
    return (
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-slate-600 text-lg font-light">
          {loading ? 'Loading gallery...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-slate-600 text-lg font-light">No images available</div>
      </section>
    )
  }

  const totalHeight = Math.max(...nodes.map(n => n.y)) + 500

  return (
    <section 
      ref={scrollContainerRef}
      className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-y-auto overflow-x-hidden h-screen"
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      {/* Flowing river container */}
      <div 
        className="relative w-full"
        style={{ 
          height: `${totalHeight}px`,
          minHeight: '100vh',
        }}
      >
        {/* Subtle center line (river guide) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent opacity-30"></div>

        {/* River nodes (photos) */}
        {nodes.map((node, index) => {
          // Calculate visibility and animation based on scroll
          const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
          const scrollTop = scrollProgress * (totalHeight - viewportHeight)
          const nodeCenter = node.y
          const distanceFromViewport = Math.abs(nodeCenter - scrollTop - viewportHeight / 2)
          const isInView = distanceFromViewport < viewportHeight * 1.5
          
          if (!isInView) return null

          // Calculate scale based on distance from viewport center
          const scale = Math.max(0.85, 1 - distanceFromViewport / (viewportHeight * 2))
          const opacity = Math.max(0.3, 1 - distanceFromViewport / (viewportHeight * 1.2))

          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${node.x}%`,
                top: node.y,
                width: node.size,
                height: node.size,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale,
                opacity,
                rotate: node.rotation,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              whileHover={{
                scale: scale * 1.15,
                rotate: 0,
                zIndex: 100,
                transition: { duration: 0.3 }
              }}
            >
              {/* Photo card */}
              <div 
                className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
              >
                <Image
                  src={getImageUrl(node.image.image_path) || "/placeholder.svg"}
                  alt={node.image.alt_text || `Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 250px, 320px"
                  className="object-cover"
                  loading="lazy"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-light truncate">
                      {node.image.alt_text || `Image ${index + 1}`}
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      {index + 1} of {nodes.length}
                    </p>
                  </div>
                </div>

                {/* Subtle border */}
                <div className="absolute inset-0 rounded-2xl border border-slate-200/50"></div>
              </div>

              {/* Ripple effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-slate-300 pointer-events-none"
                initial={{ scale: 1, opacity: 0 }}
                whileHover={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          )
        })}

        {/* Flow indicators (small dots showing the river path) */}
        {nodes.filter((_, i) => i % 5 === 0).map((node) => (
          <motion.div
            key={`dot-${node.id}`}
            className="absolute w-2 h-2 rounded-full bg-slate-300/40"
            style={{
              left: `${node.x}%`,
              top: node.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: node.index * 0.01 }}
          />
        ))}
      </div>

      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-slate-400 to-slate-600"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Info panel */}
      <div className="fixed top-6 left-6 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-lg z-50 border border-slate-200/50">
        <h3 className="text-slate-800 text-sm font-medium mb-1">Flowing River Gallery</h3>
        <p className="text-slate-500 text-xs">{nodes.length} photos</p>
      </div>

      {/* Photo counter */}
      <div className="fixed top-6 right-6 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-lg z-50 border border-slate-200/50">
        <p className="text-slate-800 text-sm font-medium">
          {Math.min(Math.floor(scrollProgress * nodes.length) + 1, nodes.length)} / {nodes.length}
        </p>
      </div>

      {/* Instructions */}
      <motion.div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-200/50">
          <p className="text-slate-600 text-sm font-light">
            Scroll to flow through the gallery • Hover to view details
          </p>
        </div>
      </motion.div>

      {/* Scroll hint arrow (only show at top) */}
      {scrollProgress < 0.05 && (
        <motion.div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      )}
    </section>
  )
}