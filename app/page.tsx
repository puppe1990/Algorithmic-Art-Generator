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
      }
    },
    [parameters, drawCirclePattern, drawTrianglePattern, drawLinePattern, drawSpiral],
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
    const patterns = ["circles", "triangles", "lines", "spiral"]
    const palettes = Object.keys(colorPalettes)

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
