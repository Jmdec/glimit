"use client"
import { useIsMobile, useIsTablet } from "@/hooks/use-device"
import { motion, useScroll } from "framer-motion"
import Image from "next/image"
import { useEffect, useState, useRef, useMemo } from "react"

interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

interface GalaxyPhoto {
  id: number
  image: FilmStripImage
  angle: number
  radius: number
  depth: number
  spiralIndex: number
  size: number
}

export function SpiralGalaxyGallery() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [photos, setPhotos] = useState<GalaxyPhoto[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Generate stable star positions once on mount
  const stars = useMemo(() => {
    if (!isMounted) return []
    return [...Array(200)].map((_, i) => ({
      id: i,
      width: (i * 17 % 100) / 50 + 1, // Pseudo-random but stable
      height: (i * 13 % 100) / 50 + 1,
      left: (i * 37 % 10000) / 100,
      top: (i * 71 % 10000) / 100,
      animationDelay: (i * 23 % 300) / 100,
    }))
  }, [isMounted])
  
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef
  })

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

  // Create spiral galaxy layout
  useEffect(() => {
    if (galleryImages.length === 0) return

    const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // ~137.5 degrees for natural spiral
    const baseSize = isMobile ? 120 : 180

    const galaxyPhotos: GalaxyPhoto[] = galleryImages.map((image, index) => {
      // Create logarithmic spiral (like real galaxies)
      const spiralIndex = index
      const angle = spiralIndex * goldenAngle
      
      // Fibonacci-inspired radius growth
      const radius = Math.sqrt(spiralIndex + 1) * (isMobile ? 60 : 80)
      
      // Depth increases as we go outward (scroll down to go deeper into galaxy)
      const depth = spiralIndex * 100
      
      // Size decreases slightly as we go outward for perspective
      const size = baseSize + ((spiralIndex * 17) % 41 - 20) // Stable pseudo-random

      return {
        id: image.id,
        image,
        angle,
        radius,
        depth,
        spiralIndex,
        size,
      }
    })

    setPhotos(galaxyPhotos)
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
      <section className="bg-black overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-purple-400 text-lg animate-pulse">
          {loading ? 'Initializing galaxy...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="bg-black overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-purple-400 text-lg">No images available</div>
      </section>
    )
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="relative bg-black overflow-y-scroll overflow-x-hidden h-screen"
      style={{ 
        perspective: '1200px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#7c3aed #000000'
      }}
    >
      {/* Scrollable content - creates the depth */}
      <div style={{ height: `${photos.length * 100 + 1000}px` }}>
        <div className="sticky top-0 w-full h-screen flex items-center justify-center">
          
          {/* Starfield background */}
          <div className="absolute inset-0 overflow-hidden">
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute bg-white rounded-full"
                style={{
                  width: star.width + 'px',
                  height: star.height + 'px',
                  left: star.left + '%',
                  top: star.top + '%',
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + (star.animationDelay % 2),
                  repeat: Infinity,
                  delay: star.animationDelay,
                }}
              />
            ))}
          </div>

          {/* Galaxy core glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-gradient-radial from-purple-500/30 via-blue-500/10 to-transparent blur-3xl"></div>
          </div>

          {/* Spiral arms with photos */}
          <div 
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center"
          >
            {photos.map((photo, index) => {
              // Calculate position based on scroll and photo depth
              const scrollProgress = scrollYProgress.get() || 0
              const depthProgress = scrollProgress * photos.length * 100
              
              // Distance from current scroll position
              const distanceFromView = photo.depth - depthProgress
              
              // Scale based on distance (closer = bigger)
              const scale = Math.max(0.3, Math.min(2, 1 - distanceFromView / 3000))
              
              // Opacity fades as photos get further away
              const opacity = distanceFromView > -500 && distanceFromView < 2000
                ? Math.max(0.2, Math.min(1, 1 - Math.abs(distanceFromView) / 2000))
                : 0
              
              // Calculate X and Y position in spiral
              const spiralRotation = scrollProgress * Math.PI * 4 // Rotate as you scroll
              const x = Math.cos(photo.angle + spiralRotation) * photo.radius * scale
              const y = Math.sin(photo.angle + spiralRotation) * photo.radius * scale
              
              // Z-index based on distance (closer photos on top)
              const zIndex = Math.floor(1000 - distanceFromView)
              
              // Blur distant photos
              const blur = Math.abs(distanceFromView) > 500 
                ? Math.min(10, Math.abs(distanceFromView) / 200) 
                : 0

              // Rotation based on position in spiral
              const rotation = (photo.angle * 180 / Math.PI) + (scrollProgress * 360)

              const isSelected = selectedPhoto === photo.id
              const isInView = opacity > 0.2

              return isInView ? (
                <motion.div
                  key={photo.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: photo.size,
                    height: photo.size,
                    zIndex: isSelected ? 9999 : zIndex,
                  }}
                  animate={{
                    x,
                    y,
                    scale: isSelected ? scale * 1.5 : scale,
                    opacity: isSelected ? 1 : opacity,
                    rotate: isSelected ? 0 : rotation * 0.1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  onClick={() => setSelectedPhoto(isSelected ? null : photo.id)}
                  onHoverStart={() => !isSelected && setSelectedPhoto(null)}
                >
                  <div 
                    className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl"
                    style={{
                      filter: `blur(${isSelected ? 0 : blur}px)`,
                      boxShadow: isSelected 
                        ? '0 0 60px rgba(147, 51, 234, 0.8), 0 0 120px rgba(59, 130, 246, 0.4)'
                        : `0 20px 60px rgba(0,0,0,0.5)`
                    }}
                  >
                    <Image
                      src={getImageUrl(photo.image.image_path) || "/placeholder.svg"}
                      alt={photo.image.alt_text || `Galaxy photo ${photo.id}`}
                      fill
                      sizes="(max-width: 768px) 150px, 220px"
                      className="object-cover"
                      loading="lazy"
                    />
                    
                    {/* Cosmic glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 border-4 border-purple-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}

                    {/* Photo number in corner */}
                    <div className="absolute top-2 right-2 bg-black/60 text-purple-300 text-xs px-2 py-1 rounded font-mono">
                      #{photo.spiralIndex + 1}
                    </div>
                  </div>

                  {/* Orbiting particles around selected photo */}
                  {isSelected && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-purple-400 rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                          animate={{
                            x: Math.cos((i / 6) * Math.PI * 2) * 80,
                            y: Math.sin((i / 6) * Math.PI * 2) * 80,
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              ) : null
            })}
          </div>

          {/* Center black hole effect */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-radial from-black via-purple-900/50 to-transparent border border-purple-500/30"></div>
          </motion.div>

          {/* Instructions overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-50">
            <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/30">
              <p className="text-purple-300 text-sm font-light tracking-wider">
                Scroll to journey through the galaxy • Click photos to focus
              </p>
            </div>
          </div>

          {/* Depth indicator */}
          <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30">
            <p className="text-purple-300 text-xs font-mono">
              DEPTH: {Math.floor(scrollYProgress.get() * 100)}%
            </p>
            <p className="text-blue-300 text-xs font-mono">
              PHOTOS: {photos.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}