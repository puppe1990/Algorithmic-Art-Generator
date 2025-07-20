"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Shuffle, Play, Pause, Film, Loader2 } from "lucide-react"
import { useGifJs } from "@/components/gif-recorder"

/* ---------- Types & Constants ---------- */

interface ArtParameters {
  pattern: string
  colorPalette: string
  shapeCount: number
  shapeSize: number
  animationSpeed: number
  rotationSpeed: number
  opacity: number
  complexity: number
  isAnimated: boolean
  // Fractal specific parameters
  fractalType: string
  fractalIterations: number
  fractalScale: number
  fractalAngle: number
}

const colorPalettes = {
  sunset: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
  ocean: ["#0077BE", "#00A8CC", "#7FB3D3", "#C5E4FD", "#E8F4FD"],
  forest: ["#2D5016", "#61892F", "#86C232", "#C6E377", "#E8F5E8"],
  cosmic: ["#2C1810", "#5D4E75", "#B19CD9", "#C9A9DD", "#E6E6FA"],
  fire: ["#8B0000", "#DC143C", "#FF4500", "#FF6347", "#FFA07A"],
  monochrome: ["#000000", "#404040", "#808080", "#C0C0C0", "#FFFFFF"],
} as const

type PaletteKey = keyof typeof colorPalettes

/* ---------- Page Component ---------- */

export default function AlgorithmicArtGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const gifReady = useGifJs()
  const [recording, setRecording] = useState(false)

  const [parameters, setParameters] = useState<ArtParameters>({
    pattern: "circles",
    colorPalette: "sunset",
    shapeCount: 50,
    shapeSize: 20,
    animationSpeed: 1,
    rotationSpeed: 1,
    opacity: 0.7,
    complexity: 3,
    isAnimated: true,
    fractalType: "mandala",
    fractalIterations: 100,
    fractalScale: 0.5,
    fractalAngle: 0.5,
  })

  const updateParameter = (key: keyof ArtParameters, value: any) => setParameters((prev) => ({ ...prev, [key]: value }))

  /* ---------- Drawing Helpers ---------- */

  const drawCirclePattern = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas

      for (let i = 0; i < shapeCount; i++) {
        const angle = (i / shapeCount) * Math.PI * 2 * complexity + time * animationSpeed * 0.01
        const radius = Math.min(width, height) * 0.3
        const x = width / 2 + Math.cos(angle) * radius * (0.5 + Math.sin(time * rotationSpeed * 0.005 + i) * 0.3)
        const y = height / 2 + Math.sin(angle) * radius * (0.5 + Math.cos(time * rotationSpeed * 0.005 + i) * 0.3)

        ctx.globalAlpha = opacity
        ctx.fillStyle = colors[i % colors.length]
        ctx.beginPath()
        ctx.arc(x, y, shapeSize * (0.5 + Math.sin(time * 0.01 + i) * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [parameters],
  )

  const drawTrianglePattern = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas

      for (let i = 0; i < shapeCount; i++) {
        const angle = (i / shapeCount) * Math.PI * 2 * complexity + time * animationSpeed * 0.01
        const radius = Math.min(width, height) * 0.25
        const x = width / 2 + Math.cos(angle) * radius
        const y = height / 2 + Math.sin(angle) * radius

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle + time * rotationSpeed * 0.01)
        ctx.globalAlpha = opacity
        ctx.fillStyle = colors[i % colors.length]

        const size = shapeSize * (0.5 + Math.sin(time * 0.01 + i) * 0.5)
        ctx.beginPath()
        ctx.moveTo(0, -size)
        ctx.lineTo(-size * 0.866, size * 0.5)
        ctx.lineTo(size * 0.866, size * 0.5)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
    },
    [parameters],
  )

  const drawLinePattern = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas

      ctx.lineWidth = 3
      for (let i = 0; i < shapeCount; i++) {
        const angle = (i / shapeCount) * Math.PI * 2 * complexity + time * animationSpeed * 0.01
        const startRadius = 50
        const endRadius = Math.min(width, height) * 0.4

        const startX = width / 2 + Math.cos(angle) * startRadius
        const startY = height / 2 + Math.sin(angle) * startRadius
        const endX = width / 2 + Math.cos(angle + time * rotationSpeed * 0.005) * endRadius
        const endY = height / 2 + Math.sin(angle + time * rotationSpeed * 0.005) * endRadius

        ctx.globalAlpha = opacity
        ctx.strokeStyle = colors[i % colors.length]
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    },
    [parameters],
  )

  const drawSpiral = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { shapeCount, shapeSize, animationSpeed, rotationSpeed, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas

      for (let i = 0; i < shapeCount; i++) {
        const t = (i / shapeCount) * complexity * Math.PI * 2 + time * animationSpeed * 0.01
        const radius = (i / shapeCount) * Math.min(width, height) * 0.4
        const x = width / 2 + Math.cos(t + time * rotationSpeed * 0.005) * radius
        const y = height / 2 + Math.sin(t + time * rotationSpeed * 0.005) * radius

        ctx.globalAlpha = opacity
        ctx.fillStyle = colors[i % colors.length]
        ctx.beginPath()
        ctx.arc(x, y, shapeSize * (0.3 + Math.sin(time * 0.01 + i) * 0.2), 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [parameters],
  )

  /* ---------- Fractal Drawing Functions ---------- */

  const drawMandelbrotFractal = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { fractalIterations, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      const centerX = -0.5 + Math.sin(time * 0.001) * 0.1
      const centerY = 0 + Math.cos(time * 0.001) * 0.1
      const zoom = 4 / Math.min(width, height) * (1 + Math.sin(time * 0.002) * 0.2)

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const a = (x - width / 2) * zoom + centerX
          const b = (y - height / 2) * zoom + centerY

          let ca = a
          let cb = b
          let n = 0

          while (n < fractalIterations) {
            const aa = ca * ca - cb * cb
            const bb = 2 * ca * cb

            ca = aa + a
            cb = bb + b

            if (ca * ca + cb * cb > 16) break
            n++
          }

          const colorIndex = Math.floor((n / fractalIterations) * colors.length)
          const color = colors[colorIndex % colors.length]
          const rgb = parseInt(color.slice(1), 16)
          
          const pixelIndex = (y * width + x) * 4
          data[pixelIndex] = (rgb >> 16) & 255     // R
          data[pixelIndex + 1] = (rgb >> 8) & 255  // G
          data[pixelIndex + 2] = rgb & 255         // B
          data[pixelIndex + 3] = Math.floor(255 * opacity) // A
        }
      }

      ctx.putImageData(imageData, 0, 0)
    },
    [parameters],
  )

  const drawJuliaFractal = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { fractalIterations, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      const ca = Math.sin(time * 0.001) * 0.8
      const cb = Math.cos(time * 0.001) * 0.8
      const zoom = 4 / Math.min(width, height)

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let a = (x - width / 2) * zoom
          let b = (y - height / 2) * zoom
          let n = 0

          while (n < fractalIterations) {
            const aa = a * a - b * b
            const bb = 2 * a * b

            a = aa + ca
            b = bb + cb

            if (a * a + b * b > 16) break
            n++
          }

          const colorIndex = Math.floor((n / fractalIterations) * colors.length)
          const color = colors[colorIndex % colors.length]
          const rgb = parseInt(color.slice(1), 16)
          
          const pixelIndex = (y * width + x) * 4
          data[pixelIndex] = (rgb >> 16) & 255
          data[pixelIndex + 1] = (rgb >> 8) & 255
          data[pixelIndex + 2] = rgb & 255
          data[pixelIndex + 3] = Math.floor(255 * opacity)
        }
      }

      ctx.putImageData(imageData, 0, 0)
    },
    [parameters],
  )

  const drawSierpinskiTriangle = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { fractalIterations, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas

      const drawTriangle = (x: number, y: number, size: number, depth: number) => {
        if (depth >= fractalIterations || size < 2) return

        ctx.globalAlpha = opacity * (1 - depth / fractalIterations)
        ctx.fillStyle = colors[depth % colors.length]
        
        ctx.beginPath()
        ctx.moveTo(x, y - size / 2)
        ctx.lineTo(x - size / 2, y + size / 2)
        ctx.lineTo(x + size / 2, y + size / 2)
        ctx.closePath()
        ctx.fill()

        const newSize = size / 2
        drawTriangle(x, y - size / 4, newSize, depth + 1)
        drawTriangle(x - size / 4, y + size / 4, newSize, depth + 1)
        drawTriangle(x + size / 4, y + size / 4, newSize, depth + 1)
      }

      const size = Math.min(width, height) * 0.6
      const centerX = width / 2
      const centerY = height / 2 + size / 4

      drawTriangle(centerX, centerY, size, 0)
    },
    [parameters],
  )

  const drawKochSnowflake = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { fractalIterations, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas

      const kochCurve = (x1: number, y1: number, x2: number, y2: number, depth: number) => {
        if (depth === 0) {
          ctx.globalAlpha = opacity
          ctx.strokeStyle = colors[depth % colors.length]
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
          return
        }

        const dx = x2 - x1
        const dy = y2 - y1
        const x3 = x1 + dx / 3
        const y3 = y1 + dy / 3
        const x4 = x1 + 2 * dx / 3
        const y4 = y1 + 2 * dy / 3

        const angle = Math.atan2(dy, dx) - Math.PI / 3
        const length = Math.sqrt(dx * dx + dy * dy) / 3
        const x5 = x3 + Math.cos(angle) * length
        const y5 = y3 + Math.sin(angle) * length

        kochCurve(x1, y1, x3, y3, depth - 1)
        kochCurve(x3, y3, x5, y5, depth - 1)
        kochCurve(x5, y5, x4, y4, depth - 1)
        kochCurve(x4, y4, x2, y2, depth - 1)
      }

      const size = Math.min(width, height) * 0.3
      const centerX = width / 2
      const centerY = height / 2

      // Draw three sides of the snowflake
      const angle = (time * 0.001) % (Math.PI * 2)
      for (let i = 0; i < 3; i++) {
        const sideAngle = angle + (i * Math.PI * 2) / 3
        const x1 = centerX + Math.cos(sideAngle) * size
        const y1 = centerY + Math.sin(sideAngle) * size
        const x2 = centerX + Math.cos(sideAngle + Math.PI * 2 / 3) * size
        const y2 = centerY + Math.sin(sideAngle + Math.PI * 2 / 3) * size
        kochCurve(x1, y1, x2, y2, Math.min(fractalIterations, 5))
      }
    },
    [parameters],
  )

  const drawDragonCurve = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { fractalIterations, opacity, complexity } = parameters
      const colors = colorPalettes[parameters.colorPalette as PaletteKey]
      const { width, height } = ctx.canvas

      const dragonCurve = (x: number, y: number, length: number, angle: number, depth: number, direction: number) => {
        if (depth === 0) {
          const endX = x + Math.cos(angle) * length
          const endY = y + Math.sin(angle) * length
          
          ctx.globalAlpha = opacity
          ctx.strokeStyle = colors[depth % colors.length]
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(endX, endY)
          ctx.stroke()
          return { x: endX, y: endY }
        }

        const newLength = length / Math.sqrt(2)
        const newAngle1 = angle - Math.PI / 4 * direction
        const newAngle2 = angle + Math.PI / 4 * direction

        const mid = dragonCurve(x, y, newLength, newAngle1, depth - 1, 1)
        return dragonCurve(mid.x, mid.y, newLength, newAngle2, depth - 1, -1)
      }

      const size = Math.min(width, height) * 0.3
      const centerX = width / 2 - size / 2
      const centerY = height / 2
      const angle = (time * 0.001) % (Math.PI * 2)

      dragonCurve(centerX, centerY, size, angle, Math.min(fractalIterations, 12), 1)
    },
    [parameters],
  )

  const drawMandalFractal = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { fractalIterations, opacity, complexity } = parameters
      const { width, height } = ctx.canvas
      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = Math.min(width, height) * 0.4

      // Cores específicas para o mandala fractal
      const mandalaColors = [
        '#00FFFF', // Ciano brilhante
        '#00FF00', // Verde vibrante
        '#FF0000', // Vermelho
        '#FFFF00', // Amarelo
        '#FF00FF', // Magenta
        '#0080FF', // Azul
        '#FF8000', // Laranja
        '#8000FF'  // Roxo
      ]

      // Função para desenhar um ponto do mandala
      const drawMandalaPoint = (angle: number, radius: number, depth: number, baseAngle: number) => {
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        // Efeito de ondulação baseado no tempo
        const wave = Math.sin(time * 0.002 + angle * 8) * 0.1
        const waveRadius = radius * (1 + wave)
        
        const finalX = centerX + Math.cos(angle) * waveRadius
        const finalY = centerY + Math.sin(angle) * waveRadius

        // Círculo central brilhante
        if (depth === 0) {
          ctx.globalAlpha = opacity
          ctx.fillStyle = mandalaColors[0]
          ctx.shadowColor = mandalaColors[0]
          ctx.shadowBlur = 20
          ctx.beginPath()
          ctx.arc(finalX, finalY, 8, 0, Math.PI * 2)
          ctx.fill()
          
          // Padrão interno do círculo central
          ctx.globalAlpha = opacity * 0.8
          ctx.fillStyle = mandalaColors[2] // Vermelho
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.arc(finalX, finalY, 4, 0, Math.PI * 2)
          ctx.fill()
          
          // Núcleo amarelo
          ctx.globalAlpha = opacity
          ctx.fillStyle = mandalaColors[3] // Amarelo
          ctx.shadowBlur = 5
          ctx.beginPath()
          ctx.arc(finalX, finalY, 1.5, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Linhas de conexão com efeito neon
          const colorIndex = (depth + Math.floor(time * 0.01)) % mandalaColors.length
          ctx.strokeStyle = mandalaColors[colorIndex]
          ctx.lineWidth = 2 + depth * 0.5
          ctx.globalAlpha = opacity * (1 - depth / fractalIterations)
          ctx.shadowColor = mandalaColors[colorIndex]
          ctx.shadowBlur = 5 + depth * 2
          
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.lineTo(finalX, finalY)
          ctx.stroke()
        }
      }

      // Desenhar o padrão de 8 pontos principais
      const numPoints = 8
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 + time * 0.001
        const radius = maxRadius * 0.3
        
        // Desenhar pontos principais
        drawMandalaPoint(angle, radius, 0, angle)
        
        // Desenhar sub-padrões recursivos
        for (let depth = 1; depth < Math.min(fractalIterations, 6); depth++) {
          const subRadius = radius * (0.5 + depth * 0.2)
          const subAngle = angle + Math.sin(time * 0.003 + depth) * 0.5
          drawMandalaPoint(subAngle, subRadius, depth, angle)
        }
      }

      // Desenhar anéis concêntricos com padrões complexos
      for (let ring = 1; ring <= 4; ring++) {
        const ringRadius = maxRadius * (0.1 + ring * 0.15)
        const pointsInRing = numPoints * (ring + 1)
        
        for (let i = 0; i < pointsInRing; i++) {
          const angle = (i / pointsInRing) * Math.PI * 2 + time * 0.002
          const radius = ringRadius + Math.sin(time * 0.001 + i) * 10
          
          const colorIndex = (i + ring) % mandalaColors.length
          ctx.strokeStyle = mandalaColors[colorIndex]
          ctx.lineWidth = 1 + ring * 0.5
          ctx.globalAlpha = opacity * (0.8 - ring * 0.1)
          ctx.shadowColor = mandalaColors[colorIndex]
          ctx.shadowBlur = 3 + ring
          
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius
          
          // Desenhar pequenos círculos nos pontos
          ctx.beginPath()
          ctx.arc(x, y, 2 + ring, 0, Math.PI * 2)
          ctx.stroke()
          
          // Linhas de conexão entre pontos próximos
          if (i > 0) {
            const prevAngle = ((i - 1) / pointsInRing) * Math.PI * 2 + time * 0.002
            const prevRadius = ringRadius + Math.sin(time * 0.001 + i - 1) * 10
            const prevX = centerX + Math.cos(prevAngle) * prevRadius
            const prevY = centerY + Math.sin(prevAngle) * prevRadius
            
            ctx.beginPath()
            ctx.moveTo(prevX, prevY)
            ctx.lineTo(x, y)
            ctx.stroke()
          }
        }
      }

      // Resetar sombras
      ctx.shadowBlur = 0
    },
    [parameters],
  )

  const drawFractal = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      switch (parameters.fractalType) {
        case "mandelbrot":
          drawMandelbrotFractal(ctx, time)
          break
        case "julia":
          drawJuliaFractal(ctx, time)
          break
        case "sierpinski":
          drawSierpinskiTriangle(ctx, time)
          break
        case "koch":
          drawKochSnowflake(ctx, time)
          break
        case "dragon":
          drawDragonCurve(ctx, time)
          break
        case "mandala":
          drawMandalFractal(ctx, time)
          break
        default:
          drawMandelbrotFractal(ctx, time)
      }
    },
    [parameters, drawMandelbrotFractal, drawJuliaFractal, drawSierpinskiTriangle, drawKochSnowflake, drawDragonCurve, drawMandalFractal],
  )

  const drawArt = useCallback(
    (time = 0) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Background
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2,
      )
      gradient.addColorStop(0, "#1a1a2e")
      gradient.addColorStop(1, "#16213e")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Pattern
      switch (parameters.pattern) {
        case "circles":
          drawCirclePattern(ctx, time)
          break
        case "triangles":
          drawTrianglePattern(ctx, time)
          break
        case "lines":
          drawLinePattern(ctx, time)
          break
        case "spiral":
          drawSpiral(ctx, time)
          break
        case "fractal":
          drawFractal(ctx, time)
          break
      }
    },
    [parameters, drawCirclePattern, drawTrianglePattern, drawLinePattern, drawSpiral, drawFractal],
  )

  /* ---------- Animation Loop ---------- */

  const animate = useCallback(
    (time: number) => {
      if (parameters.isAnimated) {
        drawArt(time)
        animationRef.current = requestAnimationFrame(animate)
      }
    },
    [parameters.isAnimated, drawArt],
  )

  useEffect(() => {
    if (parameters.isAnimated) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      drawArt()
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [parameters, animate, drawArt])

  /* ---------- Resize Handling ---------- */

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      drawArt()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [drawArt])

  /* ---------- Utility Actions ---------- */

  const randomizeParameters = () => {
    const patterns = ["circles", "triangles", "lines", "spiral", "fractal"]
    const palettes = Object.keys(colorPalettes)
    const fractalTypes = ["mandelbrot", "julia", "sierpinski", "koch", "dragon", "mandala"]

    setParameters({
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      colorPalette: palettes[Math.floor(Math.random() * palettes.length)],
      shapeCount: Math.floor(Math.random() * 100) + 20,
      shapeSize: Math.floor(Math.random() * 40) + 10,
      animationSpeed: Number((Math.random() * 3 + 0.5).toFixed(1)),
      rotationSpeed: Number((Math.random() * 3 + 0.5).toFixed(1)),
      opacity: Number((Math.random() * 0.5 + 0.3).toFixed(2)),
      complexity: Math.floor(Math.random() * 5) + 1,
      isAnimated: Math.random() > 0.3,
      fractalType: fractalTypes[Math.floor(Math.random() * fractalTypes.length)],
      fractalIterations: Math.floor(Math.random() * 200) + 50,
      fractalScale: Number((Math.random() * 0.8 + 0.2).toFixed(2)),
      fractalAngle: Number((Math.random() * Math.PI).toFixed(2)),
    })
  }

  const savePng = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (parameters.isAnimated) drawArt(performance.now())

    const link = document.createElement("a")
    link.download = `algorithmic-art-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  /* ---------- GIF Recording ---------- */

  const saveGif = async () => {
    if (!gifReady || recording || !parameters.isAnimated) return

    const canvas = canvasRef.current
    const GIF = (window as any).GIF as any
    if (!canvas || !GIF) return

    setRecording(true)

    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: "/gif.worker.js",
      width: canvas.width,
      height: canvas.height,
    })

    // Capture ~3 s at 20 FPS
    const frames = 60
    const delay = 50 // ms

    for (let i = 0; i < frames; i++) {
      drawArt(performance.now() + i * delay)
      gif.addFrame(canvas, { copy: true, delay })
      await new Promise((r) => setTimeout(r, delay))
    }

    gif.on("finished", (blob: Blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `algorithmic-art-${Date.now()}.gif`
      link.click()
      URL.revokeObjectURL(url)
      setRecording(false)
    })

    gif.render()
  }

  /* ---------- JSX ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Algorithmic Art Generator</h1>
          <p className="text-slate-300">Create beautiful generative art with customizable parameters</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <aside className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Controls
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={randomizeParameters}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateParameter("isAnimated", !parameters.isAnimated)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {parameters.isAnimated ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pattern */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Pattern</Label>
                  <Select value={parameters.pattern} onValueChange={(v) => updateParameter("pattern", v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="circles">Circles</SelectItem>
                      <SelectItem value="triangles">Triangles</SelectItem>
                      <SelectItem value="lines">Lines</SelectItem>
                      <SelectItem value="spiral">Spiral</SelectItem>
                      <SelectItem value="fractal">Fractal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Palette */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Color Palette</Label>
                  <Select value={parameters.colorPalette} onValueChange={(v) => updateParameter("colorPalette", v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {Object.keys(colorPalettes).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sliders */}
                {[
                  ["shapeCount", "Shape Count", 10, 200, 5, parameters.shapeCount],
                  ["shapeSize", "Shape Size", 5, 50, 1, parameters.shapeSize],
                  ["animationSpeed", "Animation Speed", 0.1, 5, 0.1, parameters.animationSpeed],
                  ["rotationSpeed", "Rotation Speed", 0.1, 5, 0.1, parameters.rotationSpeed],
                  ["opacity", "Opacity", 0.1, 1, 0.05, parameters.opacity],
                  ["complexity", "Complexity", 1, 8, 1, parameters.complexity],
                ].map(([key, label, min, max, step, value]) => (
                  <div key={key as string} className="space-y-2">
                    <Label className="text-slate-300">
                      {label}: {Number(value).toFixed(2).replace(/\.00$/, "")}
                    </Label>
                    <Slider
                      value={[value as number]}
                      min={min as number}
                      max={max as number}
                      step={step as number}
                      onValueChange={([v]) => updateParameter(key as keyof ArtParameters, v)}
                      className="[&_[role=slider]]:bg-blue-500"
                    />
                  </div>
                ))}

                {/* Fractal Type (only show when fractal pattern is selected) */}
                {parameters.pattern === "fractal" && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Fractal Type</Label>
                    <Select value={parameters.fractalType} onValueChange={(v) => updateParameter("fractalType", v)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="mandelbrot">Mandelbrot Set</SelectItem>
                        <SelectItem value="julia">Julia Set</SelectItem>
                        <SelectItem value="sierpinski">Sierpinski Triangle</SelectItem>
                        <SelectItem value="koch">Koch Snowflake</SelectItem>
                        <SelectItem value="dragon">Dragon Curve</SelectItem>
                        <SelectItem value="mandala">Mandala Fractal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Fractal-specific sliders (only show when fractal pattern is selected) */}
                {parameters.pattern === "fractal" && [
                  ["fractalIterations", "Fractal Iterations", 10, 300, 10, parameters.fractalIterations],
                  ["fractalScale", "Fractal Scale", 0.1, 1, 0.05, parameters.fractalScale],
                  ["fractalAngle", "Fractal Angle", 0, Math.PI * 2, 0.1, parameters.fractalAngle],
                ].map(([key, label, min, max, step, value]) => (
                  <div key={key as string} className="space-y-2">
                    <Label className="text-slate-300">
                      {label}: {Number(value).toFixed(2).replace(/\.00$/, "")}
                    </Label>
                    <Slider
                      value={[value as number]}
                      min={min as number}
                      max={max as number}
                      step={step as number}
                      onValueChange={([v]) => updateParameter(key as keyof ArtParameters, v)}
                      className="[&_[role=slider]]:bg-green-500"
                    />
                  </div>
                ))}

                {/* Animation Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="animation"
                    checked={parameters.isAnimated}
                    onCheckedChange={(c) => updateParameter("isAnimated", c)}
                  />
                  <Label htmlFor="animation" className="text-slate-300">
                    Enable Animation
                  </Label>
                </div>

                {/* Download Buttons */}
                <Button onClick={savePng} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Save PNG
                </Button>

                {parameters.isAnimated && (
                  <Button
                    onClick={saveGif}
                    disabled={!gifReady || recording}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60"
                  >
                    {recording ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Film className="w-4 h-4 mr-2" />}
                    {recording ? "Recording GIF…" : "Save Animated GIF"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Canvas */}
          <section className="lg:col-span-3">
            <Card className="bg-slate-800 border-slate-700 h-[600px] lg:h-[800px]">
              <CardContent className="p-0 h-full">
                <canvas ref={canvasRef} className="w-full h-full rounded-lg" style={{ display: "block" }} />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
