"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  type: "aperture" | "particle" | "filmframe"
}

export function PhotographySuccessAnimation({ isVisible }: { isVisible: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isVisible) return

    // Generate particles including apertures, sparkles, and film frames
    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.3,
      type: ["aperture", "particle", "filmframe"][Math.floor(Math.random() * 3)] as "aperture" | "particle" | "filmframe",
    }))

    setParticles(newParticles)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden bg-black/30 backdrop-blur-sm"
    >
      {/* Camera flash effect */}
      <motion.div
        className="absolute inset-0 bg-amber-400/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Center success checkmark with lens effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative w-24 h-24">
          {/* Aperture rings */}
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={`ring-${ring}`}
              className="absolute inset-0 border-2 border-amber-400 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: ring * 0.1,
                ease: "easeOut",
              }}
              style={{
                width: `${96 + ring * 20}px`,
                height: `${96 + ring * 20}px`,
                left: `${-10 - ring * 10}px`,
                top: `${-10 - ring * 10}px`,
              }}
            />
          ))}

          {/* Checkmark */}
          <motion.svg
            className="w-full h-full text-amber-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        </div>

        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold text-amber-400">Session Booked</h2>
          <p className="text-sm text-amber-200/80 tracking-wider uppercase">Your photography moment awaits</p>
        </motion.div>
      </motion.div>

      {/* Falling particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 1,
            scale: 0,
          }}
          animate={{
            y: "100vh",
            opacity: [1, 1, 0],
            scale: 1,
            rotate: 360,
          }}
          transition={{
            duration: 2 + Math.random() * 1,
            delay: particle.delay,
            ease: "easeIn",
          }}
        >
          {particle.type === "aperture" && (
            <div className="relative w-full h-full" style={{ width: `${particle.size}px`, height: `${particle.size}px` }}>
              <svg viewBox="0 0 24 24" className="w-full h-full text-amber-400 drop-shadow-lg">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          )}
          {particle.type === "filmframe" && <div className="w-full h-full bg-amber-400 rounded-sm shadow-lg border border-amber-300" />}
          {particle.type === "particle" && <div className="w-full h-full bg-amber-400 rounded-full shadow-lg blur-sm" />}
        </motion.div>
      ))}

      {/* Lens flare effects */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`flare-${i}`}
          className="absolute w-32 h-32 bg-gradient-to-r from-amber-400/20 to-transparent rounded-full blur-3xl"
          initial={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [1, 2, 3],
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
