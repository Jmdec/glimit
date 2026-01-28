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

interface HelixPhoto {
  id: number
  image: FilmStripImage
  strand: 1 | 2
  position: number
  angle: number
  height: number
  size: number
}

export function DNAHelixGalleryCompact() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [photos, setPhotos] = useState<HelixPhoto[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [autoRotation, setAutoRotation] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Auto-rotation
  useEffect(() => {
    if (!isMounted) return
    
    const interval = setInterval(() => {
      setAutoRotation(prev => (prev + 0.005) % (Math.PI * 2))
    }, 50)
    
    return () => clearInterval(interval)
  }, [isMounted])

  // Create compact DNA helix - ALL photos visible
  useEffect(() => {
    if (galleryImages.length === 0) return

    const baseSize = isMobile ? 60 : 80 // Smaller to fit more
    const totalPhotos = galleryImages.length

    const helixPhotos: HelixPhoto[] = galleryImages.map((image, index) => {
      const strand = (index % 2 === 0 ? 1 : 2) as 1 | 2
      const positionInStrand = Math.floor(index / 2)
      
      // Compress height so all photos fit in viewport
      const heightSpacing = isMobile ? 8 : 12 // Much tighter spacing
      const height = (positionInStrand * heightSpacing) - (totalPhotos * heightSpacing / 4) // Center vertically
      
      // Faster rotation for compact view
      const rotationsPerPhoto = Math.PI * 2 / 8 // Complete rotation every 8 photos
      const baseAngle = positionInStrand * rotationsPerPhoto
      const angle = strand === 1 ? baseAngle : baseAngle + Math.PI
      
      const size = baseSize

      return {
        id: image.id,
        image,
        strand,
        position: positionInStrand,
        angle,
        height,
        size,
      }
    })

    setPhotos(helixPhotos)
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
      <section className="bg-gradient-to-b from-cyan-950 via-blue-950 to-indigo-950 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-cyan-300 text-lg animate-pulse">
          {loading ? 'Sequencing DNA strands...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="bg-gradient-to-b from-cyan-950 via-blue-950 to-indigo-950 overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-cyan-300 text-lg">No images available</div>
      </section>
    )
  }

  return (
    <div 
      className="relative bg-gradient-to-b from-cyan-950 via-blue-950 to-indigo-950 overflow-hidden h-screen"
      style={{ 
        perspective: '1200px',
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Vertical axis line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"></div>

        {/* Helix container - ALL PHOTOS VISIBLE */}
        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {photos.map((photo) => {
            const isSelected = selectedPhoto === photo.id
            
            // Calculate 3D position with auto-rotation
            const helixRadius = isMobile ? 120 : 180
            const totalAngle = photo.angle + autoRotation
            
            const x = Math.cos(totalAngle) * helixRadius
            const z = Math.sin(totalAngle) * helixRadius
            const y = photo.height
            
            // Scale based on Z position (depth)
            const depthScale = (z + helixRadius) / (helixRadius * 2)
            const scale = isSelected ? 1.2 : (0.5 + depthScale * 0.5)
            
            // Opacity based on depth
            const opacity = isSelected ? 1 : (0.4 + depthScale * 0.6)
            
            // Z-index based on depth
            const zIndex = isSelected ? 9999 : Math.floor(500 + z)

            const strandColor = photo.strand === 1 ? 'cyan' : 'blue'

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
                  x,
                  y,
                  scale,
                  opacity,
                  rotateY: totalAngle * (180 / Math.PI),
                }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 15,
                }}
                onClick={() => setSelectedPhoto(isSelected ? null : photo.id)}
              >
                {/* Connection line to center axis */}
                {z > 0 && (
                  <div 
                    className="absolute left-1/2 top-1/2 origin-left h-px opacity-20"
                    style={{
                      width: Math.abs(x),
                      backgroundColor: strandColor === 'cyan' ? '#22d3ee' : '#3b82f6',
                      transform: `rotate(${Math.atan2(0, x) * 180 / Math.PI}deg)`,
                    }}
                  />
                )}

                <div 
                  className="relative w-full h-full rounded overflow-hidden shadow-xl border"
                  style={{
                    borderColor: strandColor === 'cyan' ? '#22d3ee' : '#3b82f6',
                    borderWidth: isSelected ? '3px' : '1px',
                    boxShadow: isSelected 
                      ? `0 0 30px ${strandColor === 'cyan' ? 'rgba(34, 211, 238, 0.8)' : 'rgba(59, 130, 246, 0.8)'}`
                      : `0 5px 15px rgba(0,0,0,0.5)`,
                  }}
                >
                  <Image
                    src={getImageUrl(photo.image.image_path) || "/placeholder.svg"}
                    alt={photo.image.alt_text || `DNA photo ${photo.id}`}
                    fill
                    sizes="(max-width: 768px) 80px, 100px"
                    className="object-cover"
                    loading="lazy"
                  />
                  
                  {/* Strand indicator dot */}
                  <div 
                    className="absolute top-1 left-1 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: strandColor === 'cyan' ? '#22d3ee' : '#3b82f6',
                    }}
                  />
                </div>
              </motion.div>
            )
          })}

          {/* Base pair connections */}
          {photos
            .filter(photo => photo.position % 5 === 0)
            .map(photo => {
              const partner = photos.find(
                p => p.position === photo.position && p.strand !== photo.strand
              )
              if (!partner) return null

              const helixRadius = isMobile ? 120 : 180
              const angle1 = photo.angle + autoRotation
              const angle2 = partner.angle + autoRotation
              
              const x1 = Math.cos(angle1) * helixRadius
              const z1 = Math.sin(angle1) * helixRadius
              const x2 = Math.cos(angle2) * helixRadius
              const z2 = Math.sin(angle2) * helixRadius

              if (z1 < 0 || z2 < 0) return null

              const centerX = (x1 + x2) / 2
              const distance = Math.sqrt(Math.pow(x2 - x1, 2))
              const angleRad = Math.atan2(0, x2 - x1)

              return (
                <motion.div
                  key={`pair-${photo.position}`}
                  className="absolute h-px bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: distance,
                    transformOrigin: 'center',
                  }}
                  animate={{
                    x: centerX,
                    y: photo.height,
                    rotate: angleRad * (180 / Math.PI),
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 15,
                  }}
                />
              )
            })}
        </div>

        {/* Info panel */}
        <div className="absolute top-4 right-4 bg-cyan-950/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-cyan-500/30 text-xs">
          <div className="flex gap-2 items-center mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
            <span className="text-cyan-300">Strand A</span>
          </div>
          <div className="flex gap-2 items-center mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-blue-300">Strand T</span>
          </div>
          <p className="text-cyan-300 font-mono mt-2">
            {photos.length} Photos
          </p>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="bg-cyan-950/80 backdrop-blur-sm px-6 py-2 rounded-full border border-cyan-500/30">
            <p className="text-cyan-300 text-sm">
              All {photos.length} photos visible • Auto-rotating • Click to focus
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}