"use client"
import { motion } from "framer-motion"

interface ApertureLoaderProps {
  isLoading?: boolean
  size?: number
  className?: string
}

export function ApertureLoader({ isLoading = true, size = 80, className = "" }: ApertureLoaderProps) {
  if (!isLoading) return null

  const blades = 6
  const bladeAngle = 360 / blades

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {[...Array(blades)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 bg-primary/80"
            style={{
              width: size * 0.45,
              height: size * 0.15,
              borderRadius: 4,
              transformOrigin: "left center",
              rotate: `${i * bladeAngle}deg`,
              x: "-10%",
              y: "-50%",
            }}
            animate={{
              rotate: [`${i * bladeAngle}deg`, `${i * bladeAngle + 30}deg`, `${i * bladeAngle}deg`],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background border-2 border-primary"
        style={{ width: size * 0.2, height: size * 0.2 }}
      />
    </div>
  )
}
