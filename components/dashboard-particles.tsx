"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

export function DashboardParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 1,
        vy: -Math.random() * 2 - 0.5,
        life: 0,
        maxLife: Math.random() * 150 + 100,
        size: Math.random() * 2 + 0.5,
      }
    }

    const updateParticles = () => {
      // Add new particles less frequently for subtlety
      if (Math.random() < 0.1) {
        particlesRef.current.push(createParticle())
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        return particle.life < particle.maxLife && particle.y > -10
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        const progress = particle.life / particle.maxLife
        const alpha = (1 - progress) * 0.3 // Much more subtle

        // Color transition from orange to green
        const red = Math.floor(255 * (1 - progress) + 0 * progress)
        const green = Math.floor(165 * (1 - progress) + 255 * progress)
        const blue = 0

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
        ctx.shadowBlur = 5
        ctx.shadowColor = `rgb(${red}, ${green}, ${blue})`

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-50" style={{ zIndex: 0 }} />
}
