'use client'

import { useEffect, useRef } from 'react'

interface FloatingParticlesProps {
  count?: number
  color?: string // "r, g, b"
}

export default function FloatingParticles({
  count = 15,
  color = '212, 165, 116',
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    // ⬇️ capture NON-null context
    const ctx: CanvasRenderingContext2D = context

    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      opacity: number
      maxOpacity: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 1.5 + 0.5
        this.opacity = Math.random() * 0.5 + 0.2
        this.maxOpacity = this.opacity
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1

        this.x = Math.max(0, Math.min(width, this.x))
        this.y = Math.max(0, Math.min(height, this.y))

        this.opacity =
          this.maxOpacity * (0.5 + 0.5 * Math.sin(Date.now() * 0.001))
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`
        ctx.fill()
      }
    }

    const particles: Particle[] = Array.from(
      { length: count },
      () => new Particle()
    )

    let animationId = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
      ctx.fillRect(0, 0, width, height)

      particles.forEach((p) => {
        p.update()
        p.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [count, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  )
}
