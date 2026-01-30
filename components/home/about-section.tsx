"use client"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Sparkles, Camera } from "lucide-react"
import { useRef } from "react"
import { useIsMobile, useIsTablet } from "@/hooks/use-device"

const stats = [
  { value: 20, suffix: "+", label: "Projects Completed" },
  { value: 1, suffix: "+", label: "Year Experience" },
  { value: 5, suffix: "K+", label: "Photos Delivered" },
]

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-4.22-5.78l1.42-1.42m-12.72 0l1.42 1.42m0 10.56l-1.42 1.42m12.72 0l-1.42-1.42" />
      </svg>
    ),
    title: "Expert Lighting",
    description: "Mastery of natural and studio lighting techniques",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    title: "Premium Equipment",
    description: "State-of-the-art cameras and professional gear",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Artistic Vision",
    description: "Unique creative perspective in every shot",
  },
]

// Shutter Text Component
function ShutterText({
  text,
  className = "",
  delay = 0,
  style = {},
}: {
  text: string
  className?: string
  delay?: number
  style?: React.CSSProperties
}) {
  return (
    <motion.span
      initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
      whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: "easeInOut" }}
      className={`inline-block ${className}`}
      style={style}
    >
      {text}
    </motion.span>
  )
}

// Aperture Reveal Component
function ApertureReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      whileInView={{ clipPath: "circle(100% at 50% 50%)" }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

export default function AboutSection() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  })

  // Smooth spring animation for parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "30%"])
  const imageY = useTransform(imageScrollProgress, [0, 1], ["-20%", "20%"])
  const imageScale = useTransform(imageScrollProgress, [0, 0.5, 1], [1.1, 1, 1.1])
  const imageRotate = useTransform(imageScrollProgress, [0, 1], [-3, 3])
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden" style={{ backgroundColor: "#2b1d12" }}>
      {/* Animated gradient background with parallax - matching your reference */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: backgroundY,
          background: "linear-gradient(135deg, #2b1d12 0%, #3d2817 30%, #4a2f1a 60%, #2b1d12 100%)",
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Animated orange particles with parallax depth */}
      {/* <FloatingParticles count={10} /> */}

      {/* Film perforations - bright orange */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-black/95 to-transparent z-20">
        <div className="h-full flex flex-col justify-around items-center py-8">
          {[...Array(isMobile ? 40 : 20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-5 rounded-sm"
              style={{
                background: "linear-gradient(to bottom, #ff9500, #ff8c00)",
                boxShadow: "0 0 15px rgba(255, 149, 0, 0.6), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
              initial={{ opacity: 0, scale: 0, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.3, x: 5, boxShadow: "0 0 25px rgba(255, 149, 0, 0.9)" }}
            />
          ))}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-black/95 to-transparent z-20">
        <div className="h-full flex flex-col justify-around items-center py-8">
          {[...Array(isMobile ? 40 : 20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-5 rounded-sm"
              style={{
                background: "linear-gradient(to bottom, #ff9500, #ff8c00)",
                boxShadow: "0 0 15px rgba(255, 149, 0, 0.6), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
              initial={{ opacity: 0, scale: 0, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: i * 0.03 + 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.3, x: -5, boxShadow: "0 0 25px rgba(255, 149, 0, 0.9)" }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-18 lg:px-6 relative z-10">
        {/* Header with sparkle effect */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-6 h-6" style={{ color: "#ff9500" }} />
            </motion.div>
            <p className="font-black tracking-[0.3em] text-sm" style={{ color: "#ff9500" }}>
              ABOUT US
            </p>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-6 h-6" style={{ color: "#ff9500" }} />
            </motion.div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
            <ShutterText text="Crafting Visual" className="text-white" delay={0.2} />
            <br />
            <ShutterText
              text="Stories Since 2025"
              delay={0.4}
              style={{
                background: "linear-gradient(to right, #ff9500, #ff8c00, #ff9500)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            />
          </h2>

          {/* Decorative line with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="h-1 w-32 mx-auto mt-8"
            style={{
              background: "linear-gradient(to right, transparent, #ff9500, transparent)",
            }}
          />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center justify-center mb-32">
          {/* Image with parallax and zoom effects */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <ApertureReveal delay={0.3}>
              <div className="relative max-w-sm mx-auto">
                <motion.div
                  className="relative aspect-4/5 h-80 md:h-[420px] lg:h-[500px] overflow-hidden border-4 shadow-2xl"
                  style={{
                    borderColor: "rgba(255, 149, 0, 0.5)",
                    boxShadow: "0 25px 70px rgba(255, 149, 0, 0.4)",
                    y: imageY,
                    scale: imageScale,
                    rotate: imageRotate,
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    transition: { duration: 0.5, type: "spring", stiffness: 100 },
                  }}
                >
                  <Image
                    src="/photo/photographer-working-in-professional-studio-with-c.jpg"
                    alt="G-Limit Studio photographer"
                    fill
                    sizes="w-full h-full"
                    className="object-cover"
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 mix-blend-multiply"
                    style={{
                      background: "linear-gradient(to top, rgba(43, 29, 18, 0.9), transparent, rgba(43, 29, 18, 0.4))",
                    }}
                  />

                  {/* Animated viewfinder overlay */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 1 }}
                  >
                    {/* Center focus point */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-24 h-24 border-2 rounded-full"
                        style={{ borderColor: "#ff9500" }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <div className="absolute top-1/2 left-0 w-full h-px" style={{ backgroundColor: "rgba(255, 149, 0, 0.6)" }} />
                        <div className="absolute top-0 left-1/2 w-px h-full" style={{ backgroundColor: "rgba(255, 149, 0, 0.6)" }} />
                        <motion.div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: "#ff9500",
                            boxShadow: "0 0 20px rgba(255, 149, 0, 1)",
                          }}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </motion.div>
                    </div>

                    {/* Rule of thirds grid */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-1/3 left-0 right-0 h-px" style={{ backgroundColor: "#ff9500" }} />
                      <div className="absolute top-2/3 left-0 right-0 h-px" style={{ backgroundColor: "#ff9500" }} />
                      <div className="absolute left-1/3 top-0 bottom-0 w-px" style={{ backgroundColor: "#ff9500" }} />
                      <div className="absolute left-2/3 top-0 bottom-0 w-px" style={{ backgroundColor: "#ff9500" }} />
                    </div>
                  </motion.div>

                  {/* Corner brackets */}
                  <div className="absolute inset-4">
                    {[
                      { top: 0, left: 0, x: -10, y: -10, borderLeft: "3px solid #ff9500", borderTop: "3px solid #ff9500" },
                      { top: 0, right: 0, x: 10, y: -10, borderRight: "3px solid #ff9500", borderTop: "3px solid #ff9500" },
                      { bottom: 0, left: 0, x: -10, y: 10, borderLeft: "3px solid #ff9500", borderBottom: "3px solid #ff9500" },
                      { bottom: 0, right: 0, x: 10, y: 10, borderRight: "3px solid #ff9500", borderBottom: "3px solid #ff9500" },
                    ].map((style, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-8 h-8"
                        style={style}
                        initial={{ opacity: 0, x: style.x, y: style.y }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 150 }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Camera settings badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute top-1/4 -right-2 sm:-right-6 sm:top-1/3 md:-right-10 md:top-1/4 lg:-right-16 lg:top-1/4text-black p-3 sm:p-4 md:p-6 font-mono text-xs sm:text-sm md:text-base font-bold space-y-2 shadow-xl border-2 border-black rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #ff9500, #ff8c00)",
                    boxShadow: "0 10px 40px rgba(255, 149, 0, 0.5)",
                  }}
                  whileHover={{
                    scale: 1.15,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.6 },
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span>PRO</span>{" "}
                    <motion.div
                      className="w-2 h-2 bg-black rounded-full"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-black/90">f/1.4</div>
                  <div className="text-black/90">1/250s</div>
                  <div className="text-black/90">ISO 100</div>
                </motion.div>
              </div>
            </ApertureReveal>
          </motion.div>

          {/* Text content */}
          <div className="space-y-8 mx-6">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 text-sm lg:text-xl leading-relaxed"
            >
              G-Limit Studio is dedicated to capturing life&apos;s precious moments with artistry and precision. Our team of experienced photographers
              brings a unique blend of technical expertise and creative vision to every project.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-300 text-sm lg:text-xl leading-relaxed"
            >
              From intimate portraits to grand celebrations, we approach each session with the same dedication to excellence and attention to detail
              that has made us a trusted name in photography.
            </motion.p>

            {/* Features */}
            <div className="space-y-6 pt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                  className="flex items-start gap-4 group cursor-pointer"
                  whileHover={{ x: 12 }}
                >
                  <motion.div
                    className="w-14 h-14 border-2 flex items-center justify-center shadow-lg shrink-0"
                    style={{
                      background: "rgba(255, 149, 0, 0.1)",
                      borderColor: "rgba(255, 149, 0, 0.4)",
                      boxShadow: "0 4px 20px rgba(255, 149, 0, 0.2)",
                      color: "#ff9500",
                    }}
                    whileHover={{
                      rotate: 360,
                      background: "linear-gradient(135deg, #ff9500, #ff8c00)",
                      color: "#000",
                      borderColor: "#ff9500",
                      transition: { duration: 0.6, type: "spring", stiffness: 100 },
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="pt-6"
            >
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="group bg-transparent border-2 font-bold transition-all duration-300"
                  style={{
                    borderColor: "#ff9500",
                    color: "#ff9500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #ff9500, #ff8c00)"
                    e.currentTarget.style.color = "#000"
                    e.currentTarget.style.borderColor = "#ff9500"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "#ff9500"
                    e.currentTarget.style.borderColor = "#ff9500"
                  }}
                >
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats section with film strip */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Film strip top border */}
          <div className="h-12 bg-black flex items-center justify-around mb-2 border-y-2" style={{ borderColor: "#ff9500" }}>
            {[...Array(isMobile ? 4 : isTablet ? 12 : 24)].map((_, i) => (
              <motion.div
                key={i}
                className="w-5 h-6 rounded-sm shadow-lg border"
                style={{
                  background: "linear-gradient(to bottom, #ff9500, #ff8c00)",
                  boxShadow: "0 0 15px rgba(255, 149, 0, 0.6)",
                  borderColor: "#ffaa33",
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.025, duration: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ scaleY: 1.4, scaleX: 1.3 }}
              />
            ))}
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 py-10 sm:py-16 md:py-20 bg-black px-4 sm:px-8 md:px-12 backdrop-blur-sm border-x-2"
            style={{ borderColor: "#ff9500" }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + index * 0.2,
                  type: "spring",
                  stiffness: 120,
                  damping: 10,
                }}
                className="text-center"
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <motion.div
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4"
                  style={{
                    background: "linear-gradient(to right, #ff9500, #ff8c00, #ff9500)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 30px rgba(255, 149, 0, 0.5))",
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.4 + index * 0.2,
                    type: "spring",
                    stiffness: 150,
                  }}
                >
                  {stat.value}
                  {stat.suffix}
                </motion.div>
                <p className="text-sm sm:text-base md:text-lg uppercase tracking-widest font-bold" style={{ color: "#ff9500" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Film strip bottom border */}
          <div className="h-12 bg-black flex items-center justify-around mt-2 border-y-2" style={{ borderColor: "#ff9500" }}>
            {[...Array(isMobile ? 4 : isTablet ? 12 : 24)].map((_, i) => (
              <motion.div
                key={i}
                className="w-5 h-6 rounded-sm shadow-lg border"
                style={{
                  background: "linear-gradient(to bottom, #ff9500, #ff8c00)",
                  boxShadow: "0 0 15px rgba(255, 149, 0, 0.6)",
                  borderColor: "#ffaa33",
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.025 + 0.5, duration: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ scaleY: 1.4, scaleX: 1.3 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
