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

export function ParticleBackground() {
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
      const edge = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
      let x, y, vx, vy

      switch (edge) {
        case 0: // Top edge
          x = Math.random() * canvas.width
          y = -10
          vx = (Math.random() - 0.5) * 4
          vy = Math.random() * 2 + 0.5
          break
        case 1: // Right edge
          x = canvas.width + 10
          y = Math.random() * canvas.height
          vx = -Math.random() * 2 - 0.5
          vy = (Math.random() - 0.5) * 4
          break
        case 2: // Bottom edge
          x = Math.random() * canvas.width
          y = canvas.height + 10
          vx = (Math.random() - 0.5) * 4
          vy = -Math.random() * 2 - 0.5
          break
        case 3: // Left edge
          x = -10
          y = Math.random() * canvas.height
          vx = Math.random() * 2 + 0.5
          vy = (Math.random() - 0.5) * 4
          break
        default:
          x = Math.random() * canvas.width
          y = canvas.height + 10
          vx = (Math.random() - 0.5) * 2
          vy = -Math.random() * 3 - 1
      }

      return {
        x,
        y,
        vx,
        vy,
        life: 0,
        maxLife: Math.random() * 100 + 50,
        size: Math.random() * 3 + 1,
      }
    }

    const updateParticles = () => {
      // Add new particles
      if (Math.random() < 0.3) {
        particlesRef.current.push(createParticle())
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        return (
          particle.life < particle.maxLife &&
          particle.x > -20 &&
          particle.x < canvas.width + 20 &&
          particle.y > -20 &&
          particle.y < canvas.height + 20
        )
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        const progress = particle.life / particle.maxLife
        const alpha = 1 - progress

        // Color transition from orange to green
        const red = Math.floor(255 * (1 - progress) + 0 * progress)
        const green = Math.floor(165 * (1 - progress) + 255 * progress)
        const blue = 0

        ctx.save()
        ctx.globalAlpha = alpha * 0.8
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
        ctx.shadowBlur = 10
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />
}
