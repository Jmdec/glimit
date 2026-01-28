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

interface Particle {
  id: number
  image: FilmStripImage
  x: number
  y: number
  z: number
  baseX: number
  baseY: number
  baseZ: number
  velocityX: number
  velocityY: number
  velocityZ: number
  rotation: number
  rotationSpeed: number
  size: number
}

export function ParticleSwarmGalleryAllVisible() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [galleryImages, setGalleryImages] = useState<FilmStripImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [hoveredParticle, setHoveredParticle] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

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

  // Initialize particles - ALL VISIBLE with smart distribution
  useEffect(() => {
    if (galleryImages.length === 0) return

    const baseSize = isMobile ? 100 : 140

    const newParticles: Particle[] = galleryImages.map((image, index) => {
      // Distribute in a 3D sphere to ensure all are visible
      const totalPhotos = galleryImages.length
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // Golden angle for even distribution
      
      // Spherical Fibonacci lattice for even distribution
      const theta = goldenAngle * index
      const phi = Math.acos(1 - 2 * (index + 0.5) / totalPhotos)
      
      // Map to 3D coordinates in a flattened sphere (wider, less tall)
      const radius = isMobile ? 350 : 500
      const baseX = radius * Math.sin(phi) * Math.cos(theta)
      const baseY = (radius * 0.6) * Math.cos(phi) // Flatten vertically (0.6 factor)
      const baseZ = radius * Math.sin(phi) * Math.sin(theta)

      // Initial velocities
      const speed = 0.3
      const velocityX = ((index * 17) % 100 - 50) / 100 * speed
      const velocityY = ((index * 23) % 100 - 50) / 100 * speed
      const velocityZ = ((index * 31) % 100 - 50) / 100 * speed

      // Size variation
      const size = baseSize + ((index * 13) % 41 - 20)

      return {
        id: image.id,
        image,
        x: baseX,
        y: baseY,
        z: baseZ,
        baseX,
        baseY,
        baseZ,
        velocityX,
        velocityY,
        velocityZ,
        rotation: (index * 37) % 360,
        rotationSpeed: ((index * 11) % 20 - 10) / 100,
        size,
      }
    })

    setParticles(newParticles)
  }, [galleryImages, isMobile])

  // Animation loop - continuous floating
  useEffect(() => {
    if (particles.length === 0 || !isMounted) return

    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Autonomous floating behavior
          let newX = particle.x + particle.velocityX
          let newY = particle.y + particle.velocityY
          let newZ = particle.z + particle.velocityZ

          // Gentle pull back to base position (elastic behavior)
          const pullStrength = 0.001
          newX += (particle.baseX - particle.x) * pullStrength
          newY += (particle.baseY - particle.y) * pullStrength
          newZ += (particle.baseZ - particle.z) * pullStrength

          // Add some random drift
          const drift = 0.05
          const newVelocityX = particle.velocityX + (((particle.id * 17) % 100 - 50) / 1000) * drift
          const newVelocityY = particle.velocityY + (((particle.id * 23) % 100 - 50) / 1000) * drift
          const newVelocityZ = particle.velocityZ + (((particle.id * 31) % 100 - 50) / 1000) * drift

          // Damping
          const damping = 0.99
          const finalVelocityX = newVelocityX * damping
          const finalVelocityY = newVelocityY * damping
          const finalVelocityZ = newVelocityZ * damping

          // Rotation
          const newRotation = particle.rotation + particle.rotationSpeed

          return {
            ...particle,
            x: newX,
            y: newY,
            z: newZ,
            velocityX: finalVelocityX,
            velocityY: finalVelocityY,
            velocityZ: finalVelocityZ,
            rotation: newRotation,
          }
        })
      )
    }, 1000 / 60) // 60 FPS

    return () => clearInterval(interval)
  }, [particles.length, isMounted])

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    
    mouseX.current = x * 400
    mouseY.current = y * 400

    // Apply force to nearby particles
    setParticles(prevParticles =>
      prevParticles.map(particle => {
        const dx = particle.x - mouseX.current
        const dy = particle.y - mouseY.current
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 250) {
          const force = (250 - distance) / 250
          const angle = Math.atan2(dy, dx)
          
          return {
            ...particle,
            velocityX: particle.velocityX + Math.cos(angle) * force * 3,
            velocityY: particle.velocityY + Math.sin(angle) * force * 3,
          }
        }
        
        return particle
      })
    )
  }

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
      <section className="py-16 bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-purple-300 text-lg">
          {loading ? 'Initializing particle swarm...' : 'Loading...'}
        </div>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden min-h-screen flex items-center justify-center relative">
        <div className="text-purple-300 text-lg">No images available</div>
      </section>
    )
  }

  return (
    <section 
      ref={containerRef}
      className="relative bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden min-h-screen"
      onMouseMove={handleMouseMove}
      style={{ perspective: '1500px' }}
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,40,200,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_60%)]"></div>
      
      {/* Particle container - ALL PHOTOS VISIBLE */}
      <div className="relative w-full min-h-screen flex items-center justify-center py-20">
        <div className="relative w-full h-[800px]">
          {particles.map((particle) => {
            // Calculate perspective scaling based on z position
            const maxZ = 500
            const zScale = 1 + (particle.z / 1000)
            const calculatedScale = zScale
            const opacity = Math.max(0.4, Math.min(1, 1 - Math.abs(particle.z) / 600))
            const blur = Math.abs(particle.z) > 300 ? Math.abs(particle.z) / 200 : 0
            const isHovered = hoveredParticle === particle.id

            return (
              <motion.div
                key={particle.id}
                className="absolute cursor-pointer"
                style={{
                  left: '50%',
                  top: '50%',
                  width: particle.size,
                  height: particle.size,
                  x: particle.x,
                  y: particle.y,
                  zIndex: Math.floor(particle.z + 500),
                  filter: `blur(${blur}px)`,
                }}
                animate={{
                  scale: isHovered ? calculatedScale * 1.4 : calculatedScale,
                  rotate: particle.rotation,
                  opacity: isHovered ? 1 : opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                onHoverStart={() => setHoveredParticle(particle.id)}
                onHoverEnd={() => setHoveredParticle(null)}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border border-white/10">
                  <Image
                    src={getImageUrl(particle.image.image_path) || "/placeholder.svg"}
                    alt={particle.image.alt_text || `Gallery image ${particle.id}`}
                    fill
                    sizes="(max-width: 768px) 120px, 160px"
                    className="object-cover"
                    loading="eager"
                    priority={particle.z > 0}
                  />
                  {/* Glow effect on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 via-transparent to-blue-500/40 pointer-events-none"></div>
                  )}
                  
                  {/* Depth indicator */}
                  {isHovered && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-purple-300 text-xs px-2 py-1 rounded">
                      Z: {Math.floor(particle.z)}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-50">
        <div className="bg-black/60 backdrop-blur-sm px-8 py-3 rounded-full border border-purple-500/30">
          <p className="text-purple-300 text-sm font-light tracking-wider">
            All {particles.length} photos visible • Move cursor to interact • Hover to focus
          </p>
        </div>
      </div>

      {/* Photo count */}
      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30">
        <p className="text-purple-300 text-sm font-mono">
          {particles.length} PHOTOS
        </p>
        <p className="text-purple-400 text-xs mt-1">
          FLOATING IN 3D
        </p>
      </div>
    </section>
  )
}