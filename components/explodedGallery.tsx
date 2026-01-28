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

interface ExplodedPhoto {
  id: number
  image: FilmStripImage
  angle: number
  distance: number
  orbitRadius: number
  orbitSpeed: number
  size: number
  layer: number
}

export function ExplodedViewGallery() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [photos, setPhotos] = useState<ExplodedPhoto[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [explosionProgress, setExplosionProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Manual scroll tracking instead of useScroll hook to avoid hydration issues
  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return

    const handleScroll = () => {
      const element = scrollContainerRef.current
      if (!element) return

      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
      
      setExplosionProgress(progress)
    }

    const element = scrollContainerRef.current
    element.addEventListener('scroll', handleScroll)
    
    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [isMounted])

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

  // Create exploded view layout
  useEffect(() => {
    if (galleryImages.length === 0) return

    const baseSize = isMobile ? 120 : 160
    const totalPhotos = galleryImages.length

    const explodedPhotos: ExplodedPhoto[] = galleryImages.map((image, index) => {
      // Distribute photos in concentric circles (layers)
      const layer = Math.floor(index / 20) // 20 photos per layer
      const positionInLayer = index % 20
      const photosInLayer = Math.min(20, totalPhotos - layer * 20)
      
      // Angle within the layer (evenly distributed)
      const angle = (positionInLayer / photosInLayer) * Math.PI * 2
      
      // Distance from center increases with each layer
      const baseDistance = isMobile ? 150 : 250
      const distance = baseDistance + (layer * (isMobile ? 100 : 150))
      
      // Orbit radius (how far they orbit around their position)
      const orbitRadius = 30 + (layer * 10)
      
      // Orbit speed (outer layers orbit slower)
      const orbitSpeed = 20 + (layer * 5)
      
      // Size varies slightly
      const size = baseSize + ((index * 17) % 41 - 20)

      return {
        id: image.id,
        image,
        angle,
        distance,
        orbitRadius,
        orbitSpeed,
        size,
        layer,
      }
    })

    setPhotos(explodedPhotos)
  }, [galleryImages, isMobile])

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
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-purple-300 text-lg animate-pulse">
          {loading ? 'Preparing explosion...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-purple-300 text-lg">No images available</div>
      </section>
    )
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-y-scroll overflow-x-hidden h-screen"
      style={{ 
        perspective: '1500px',
      }}
    >
      {/* Scrollable content to trigger explosion */}
      <div style={{ height: '300vh' }}>
        <div className="sticky top-0 w-full h-screen flex items-center justify-center">
          
          {/* Radial gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_80%)]"></div>
          </div>

          {/* Energy rings during explosion */}
          {explosionProgress > 0.1 && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-400/30"
                  initial={{ width: 0, height: 0, opacity: 0 }}
                  animate={{
                    width: `${(i + 1) * 200 * explosionProgress}px`,
                    height: `${(i + 1) * 200 * explosionProgress}px`,
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </>
          )}

          {/* Photos container */}
          <div 
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center"
          >
            {photos.map((photo, index) => {
              const isSelected = selectedPhoto === photo.id
              
              // Calculate explosion position
              const explosionDistance = photo.distance * Math.min(explosionProgress * 2, 1)
              
              // Base position from explosion
              const baseX = Math.cos(photo.angle) * explosionDistance
              const baseY = Math.sin(photo.angle) * explosionDistance
              
              // Add orbiting motion when fully exploded
              const orbitProgress = Math.max(0, explosionProgress - 0.5) * 2 // Start orbiting after halfway
              const orbitAngle = (Date.now() / (photo.orbitSpeed * 100)) % (Math.PI * 2)
              const orbitX = Math.cos(orbitAngle) * photo.orbitRadius * orbitProgress
              const orbitY = Math.sin(orbitAngle) * photo.orbitRadius * orbitProgress
              
              const finalX = baseX + orbitX
              const finalY = baseY + orbitY
              
              // Scale and opacity based on explosion progress
              const scale = isSelected ? 1.5 : (0.3 + (explosionProgress * 0.7))
              const opacity = isSelected ? 1 : (0.4 + (explosionProgress * 0.6))
              
              // Rotation during explosion
              const rotation = explosionProgress * 360 * (photo.layer % 2 === 0 ? 1 : -1)
              
              // Z-index based on layer (inner layers on top when selected)
              const zIndex = isSelected ? 9999 : (1000 - photo.layer * 10)

              return (
                <motion.div
                  key={photo.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: photo.size,
                    height: photo.size,
                    zIndex,
                  }}
                  animate={{
                    x: isSelected ? 0 : finalX,
                    y: isSelected ? 0 : finalY,
                    scale,
                    opacity,
                    rotate: isSelected ? 0 : rotation * 0.5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 15,
                  }}
                  onClick={() => setSelectedPhoto(isSelected ? null : photo.id)}
                >
                  <div 
                    className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      boxShadow: isSelected 
                        ? '0 0 80px rgba(168, 85, 247, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)'
                        : `0 10px 40px rgba(0,0,0,0.5)`
                    }}
                  >
                    <Image
                      src={getImageUrl(photo.image.image_path) || "/placeholder.svg"}
                      alt={photo.image.alt_text || `Exploded photo ${photo.id}`}
                      fill
                      sizes="(max-width: 768px) 150px, 200px"
                      className="object-cover"
                      loading="lazy"
                    />
                    
                    {/* Glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 pointer-events-none"></div>
                    
                    {/* Selection border */}
                    {isSelected && (
                      <>
                        <motion.div
                          className="absolute inset-0 border-4 border-purple-400 rounded-xl"
                          animate={{
                            borderColor: ['rgba(168, 85, 247, 1)', 'rgba(59, 130, 246, 1)', 'rgba(168, 85, 247, 1)'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                        
                        {/* Particle burst around selected */}
                        {[...Array(8)].map((_, i) => {
                          const particleAngle = (i / 8) * Math.PI * 2
                          return (
                            <motion.div
                              key={i}
                              className="absolute w-3 h-3 bg-purple-400 rounded-full"
                              style={{
                                left: '50%',
                                top: '50%',
                              }}
                              animate={{
                                x: Math.cos(particleAngle) * 100,
                                y: Math.sin(particleAngle) * 100,
                                scale: [0, 1, 0],
                                opacity: [1, 1, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                            />
                          )
                        })}
                      </>
                    )}

                    {/* Layer indicator */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-purple-300 text-xs px-2 py-1 rounded font-mono">
                      L{photo.layer + 1}
                    </div>
                  </div>

                  {/* Connecting line to center when selected */}
                  {isSelected && explosionProgress > 0.5 && (
                    <motion.div
                      className="absolute left-1/2 top-1/2 origin-left h-0.5 bg-gradient-to-r from-purple-400 to-transparent"
                      style={{
                        width: Math.sqrt(finalX * finalX + finalY * finalY),
                        rotate: Math.atan2(finalY, finalX) * (180 / Math.PI),
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Center point indicator */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50"></div>
            <div className="absolute inset-2 rounded-full bg-slate-900"></div>
          </motion.div>

          {/* Instructions overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-50">
            <div className="bg-slate-900/80 backdrop-blur-sm px-8 py-4 rounded-full border border-purple-500/30">
              <p className="text-purple-300 text-sm font-light tracking-wider">
                {explosionProgress < 0.1 
                  ? "Scroll down to explode the stack"
                  : explosionProgress < 0.9
                  ? "Keep scrolling to see them orbit"
                  : "Click any photo to bring it to center"}
              </p>
            </div>
          </div>

          {/* Explosion progress indicator */}
          <div className="absolute top-8 right-8 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30">
            <p className="text-purple-300 text-xs font-mono mb-1">
              EXPLOSION: {Math.floor(explosionProgress * 100)}%
            </p>
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                style={{ width: `${explosionProgress * 100}%` }}
              />
            </div>
            <p className="text-blue-300 text-xs font-mono mt-1">
              PHOTOS: {photos.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}