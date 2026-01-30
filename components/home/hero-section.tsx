"use client"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { Camera, Users, Heart, Aperture, Star, CheckCircle2, Sparkles, Award } from "lucide-react"
import FloatingParticles from "../animated-golden-particles"

// Use client-side accessible env vars
const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000"

interface HeroImage {
  id: number
  image_path: string | string[]
  image_urls?: string[]
  status: "active" | "inactive"
}

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [isFlashing, setIsFlashing] = useState(false)
  const [showCaptured, setShowCaptured] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function to get full image URL
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png"
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path
    }
    const cleanPath = path.startsWith("/") ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  // Fetch hero images from API
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setLoading(true)

        // Use Next.js API route instead of direct Laravel API call
        const response = await fetch("/api/hero-sections?status=active", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          console.error("Failed to fetch hero images:", response.statusText)
          throw new Error("Failed to fetch hero images")
        }

        const data = await response.json()
        const heroSections: HeroImage[] = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []

        // Extract all image paths and convert to full URLs
        const images: string[] = []
        heroSections.forEach((section) => {
          if (section.status === "active") {
            // Prefer image_urls if available (already full URLs from Laravel)
            if (Array.isArray(section.image_urls) && section.image_urls.length > 0) {
              images.push(...section.image_urls)
            } else if (Array.isArray(section.image_path)) {
              images.push(...section.image_path.map((path) => getImageUrl(path)))
            } else if (section.image_path) {
              images.push(getImageUrl(section.image_path))
            }
          }
        })

        // Set images or use fallback
        if (images.length > 0) {
          setHeroImages(images)
        } else {
          console.warn("No active hero images found, using fallback")
          // Fallback images if no images from API
          setHeroImages([
            "/photo/elegant-bride-in-white-wedding-dress-portrait-phot.jpg",
            "/photo/happy-couple-embracing-sunset-wedding-photography.jpg",
            "/photo/fashion-model-elegant-portrait-photography-studio.jpg",
            "/photo/newborn-baby-sleeping-peaceful-portrait-photograph.jpg",
          ])
        }
      } catch (error) {
        console.error("Error fetching hero images:", error)
        // Use fallback images on error
        setHeroImages([
          "/photo/elegant-bride-in-white-wedding-dress-portrait-phot.jpg",
          "/photo/happy-couple-embracing-sunset-wedding-photography.jpg",
          "/photo/fashion-model-elegant-portrait-photography-studio.jpg",
          "/photo/newborn-baby-sleeping-peaceful-portrait-photograph.jpg",
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchHeroImages()
  }, [])

  const handleCameraShoot = () => {
    if (heroImages.length === 0) return
    setIsFlashing(true)
    setShowCaptured(true)
    setTimeout(() => {
      setIsFlashing(false)
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 150)
    setTimeout(() => setShowCaptured(false), 1500)
  }

  // Auto-shoot every 5 seconds
  useEffect(() => {
    if (heroImages.length === 0) return
    const shootInterval = setInterval(handleCameraShoot, 5000)
    return () => clearInterval(shootInterval)
  }, [heroImages.length])

  const stats = [
    { icon: Camera, value: "500+", label: "Photo Sessions" },
    { icon: Users, value: "300+", label: "Happy Clients" },
    { icon: Heart, value: "1+", label: "Years Experience" },
  ]

  const services = ["Wedding Photography", "Portrait Sessions", "Event Coverage", "Commercial Shoots"]

  // Show loading state or placeholder
  if (loading || heroImages.length === 0) {
    return (
      <section ref={heroRef} className="relative flex items-center overflow-hidden pb-0 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-amber-950" />
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center min-h-[calc(100dvh-6rem)]">
            <div className="relative order-1 lg:order-1 mb-8 lg:mb-0">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 bg-neutral-800 animate-pulse rounded-lg" />
            </div>
            <div className="space-y-6 order-2 lg:order-2">
              <div className="h-8 w-48 bg-neutral-800 animate-pulse rounded" />
              <div className="h-16 w-full bg-neutral-800 animate-pulse rounded" />
              <div className="h-24 w-full bg-neutral-800 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={heroRef} className="relative flex items-center overflow-hidden pb-0 py-16">
      {/* Dramatic black to gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-amber-950" />
      <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 via-transparent to-transparent" />

      {/* Animated gold particles */}
      {/* <FloatingParticles count={20} /> */}

      {/* Floating gold orbs */}
      {/* <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.15, 0.3] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      /> */}

      {/* Gold flash overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-amber-300 via-amber-200 to-yellow-100 pointer-events-none z-50 mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFlashing ? 0.8 : 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Luxe top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm" />

      <motion.div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center min-h-[calc(100dvh-6rem)] lg:min-h-0">
          {/* Featured Image with gold frame */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative order-1 lg:order-1 mb-8 lg:mb-0"
          >
            <div className="relative">
              {/* Animated gold corner brackets */}
              <motion.div
                className="absolute -top-6 -left-6 w-16 h-16 border-amber-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ borderWidth: "4px 0 0 4px" }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-4 h-4 bg-amber-500"
                  animate={{ scale: [1, 0.8, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 border-amber-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{ borderWidth: "4px 4px 0 0" }}
              >
                <motion.div
                  className="absolute top-0 right-0 w-4 h-4 bg-amber-500"
                  animate={{ scale: [1, 0.8, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 border-amber-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{ borderWidth: "0 0 4px 4px" }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 w-4 h-4 bg-amber-500"
                  animate={{ scale: [1, 0.8, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-6 w-16 h-16 border-amber-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{ borderWidth: "0 4px 4px 0" }}
              >
                <motion.div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-amber-500"
                  animate={{ scale: [1, 0.8, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                />
              </motion.div>

              <div className="relative aspect-3/4 w-full max-w-md mx-auto overflow-hidden shadow-2xl shadow-amber-900/50 border-4 border-amber-500/30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={heroImages[currentImageIndex] || "/placeholder.png"}
                      alt="Featured photography"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority={currentImageIndex === 0}
                      loading={currentImageIndex === 0 ? "eager" : "lazy"}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.png"
                      }}
                      placeholder="blur"
                      blurDataURL={heroImages[currentImageIndex] || "/placeholder.png"}
                    />
                    {/* Gold gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 mix-blend-multiply" />
                  </motion.div>
                </AnimatePresence>

                {/* Premium viewfinder grid overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-amber-500/20" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-amber-500/20" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-amber-500/20" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-amber-500/20" />

                  {/* Gold focus point */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-amber-500 rounded-full"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>

                <AnimatePresence>
                  {showCaptured && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 text-black px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      CAPTURED!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              onClick={handleCameraShoot}
              className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 cursor-pointer hover:from-amber-400 hover:to-amber-500 transition-all group border-4 border-black"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <motion.div animate={{ rotate: [0, 180, 0] }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}>
                <Aperture className="w-10 h-10 text-black group-hover:text-white transition-colors" />
              </motion.div>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 border-4 border-amber-400/50 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.button>

            {/* Camera settings badge */}
            <motion.div
              className="absolute -top-4 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-full text-xs font-black shadow-xl shadow-amber-500/30 flex items-center gap-2 border-2 border-black"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.span
                className="w-2 h-2 bg-black rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
              f/1.4 · 1/200s · ISO 100
            </motion.div>

            <motion.div
              className="absolute top-16 right-0 bg-black/90 backdrop-blur-sm text-amber-500 px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-amber-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {currentImageIndex + 1} / {heroImages.length}
            </motion.div>
          </motion.div>

          <div className="space-y-6 sm:space-y-8 order-2 lg:order-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
              <div className="flex items-center gap-4 mb-4">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}>
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </motion.div>
                <p className="text-amber-500 font-black tracking-widest text-sm">G-LIMIT STUDIO</p>
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                  ))}
                  <span className="ml-1 font-bold">5.0</span>
                </span>
              </div>
            </motion.div>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-white"
              >
                We capture moments
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent"
              >
                that last forever.
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="h-1 w-32 bg-gradient-to-r from-amber-500 to-transparent origin-left"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.8 }}
              className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed"
            >
              Professional photography and videography services for weddings, events, portraits, and commercial projects. We transform fleeting
              moments into timeless memories with artistic precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              {services.map((service, index) => (
                <motion.span
                  key={service}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.7 + index * 0.1 }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-full text-sm text-amber-400 transition-all font-medium backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  {service}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 px-8 md:px-10 group font-bold shadow-xl shadow-amber-500/30 border-2 border-black"
                >
                  <Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book a Session
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black px-8 md:px-10 bg-black/50 backdrop-blur-sm font-bold"
                >
                  View Portfolio
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-amber-500/20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.3 + index * 0.1, duration: 0.5 }}
                  className="text-center group"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-amber-500/40 group-hover:to-amber-600/40 transition-all border border-amber-500/30 shadow-lg shadow-amber-500/20">
                    <stat.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Luxe bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 4, duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-7 h-12 border-2 border-amber-500 rounded-full flex justify-center pt-2 shadow-lg shadow-lg-amber-500/30">
          <motion.div
            className="w-1.5 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>
    </section>
  )
}
