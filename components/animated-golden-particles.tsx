"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Particle = {
  size: number
  left: number
  top: number
  xMove: number
  duration: number
  delay: number
}

interface FloatingParticlesProps {
  count?: number
}

export default function FloatingParticles({ count = 40 }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generated = Array.from({ length: count }, () => ({
      size: 1 + Math.random() * 4,
      left: Math.random() * 100,
      top: Math.random() * 100,
      xMove: Math.random() * 40 - 20,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 5,
    }))
    setParticles(generated)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "radial-gradient(circle, #FFD700, #FFA500)",
            boxShadow: `0 0 ${p.size * 6}px #FFD700`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, p.xMove, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
