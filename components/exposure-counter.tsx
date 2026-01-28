"use client"
import { motion, useSpring, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface ExposureCounterProps {
  value: number
  suffix?: string
  label: string
  delay?: number
}

export function ExposureCounter({ value, suffix = "", label, delay = 0 }: ExposureCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(0)

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
  })

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        spring.set(value)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, value, spring, delay])

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return () => unsubscribe()
  }, [spring])

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="relative">
        {/* Film strip decoration */}
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary/20" />
        <div className="absolute -left-2 top-1/4 w-2 h-1 bg-primary/40" />
        <div className="absolute -left-2 top-2/4 w-2 h-1 bg-primary/40" />
        <div className="absolute -left-2 top-3/4 w-2 h-1 bg-primary/40" />

        <motion.span
          className="text-5xl md:text-6xl font-light text-foreground tabular-nums"
          initial={{ filter: "blur(4px)" }}
          whileInView={{ filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        >
          {displayValue}
          {suffix}
        </motion.span>
      </div>
      <p className="text-muted-foreground text-sm mt-2 tracking-wider uppercase">{label}</p>
    </motion.div>
  )
}
