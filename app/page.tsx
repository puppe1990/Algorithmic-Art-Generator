"use client"

import { useState, useRef, useEffect, useCallback } from "react"

declare global {
  interface Window {
    GIF: {
      new (options: Record<string, unknown>): {
        addFrame: (canvas: HTMLCanvasElement, options: Record<string, unknown>) => void
        on: (event: string, callback: (blob: Blob) => void) => void
        render: () => void
      }
    }
  }
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Download,
  Shuffle,
  Play,
  Pause,
  Film,
  Loader2,
  Maximize,
  Minimize,
} from "lucide-react"
import { useGifJs } from "@/components/gif-recorder"
// import useAudioInput from "@/hooks/use-audio-input"
import { addItem, GalleryItem } from "@/lib/gallery"
import ColorPaletteEditor from "@/components/color-palette-editor"

import { ArtParameters, AudioData } from "@/lib/types"
import { colorPalettes, backgroundColors } from "@/lib/constants"
import { drawCirclePattern, drawTrianglePattern, drawLinePattern, drawSpiral, drawStarPattern } from "@/lib/patterns"
import { drawFractal } from "@/lib/fractals"
import { cn } from "@/lib/utils"

/* ---------- Types & Constants ---------- */

/* ---------- Page Component ---------- */

export default function AlgorithmicArtGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const gifReady = useGifJs()
  const [recording, setRecording] = useState(false)
  const [videoRecording, setVideoRecording] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [customPalettes, setCustomPalettes] = useState<Record<string, string[]>>({})
  const [paletteSelection, setPaletteSelection] = useState("sunset")
  const [zoomLevel, setZoomLevel] = useState(1)
  const boardRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [customBackground, setCustomBackground] = useState({
    primary: "#1a1a2e",
    secondary: "#16213e",
  })
  const allBackgroundColors: Record<string, { primary: string; secondary: string }> = {
    ...backgroundColors,
    custom: customBackground,
  }

  useEffect(() => {
    const stored = localStorage.getItem("customPalettes")
    if (stored) setCustomPalettes(JSON.parse(stored))
    const storedBg = localStorage.getItem("customBackground")
    if (storedBg) setCustomBackground(JSON.parse(storedBg))
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

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
    audioReactive: false,
    backgroundColor: "dark",
    fractalType: "mandala",
    fractalIterations: 100,
    fractalScale: 0.5,
    fractalAngle: 0.5,
  })

  // const audioData = useAudioInput(parameters.audioReactive)

  const updateParameter = <K extends keyof ArtParameters>(key: K, value: ArtParameters[K]) => setParameters((prev) => ({ ...prev, [key]: value }))

  const saveCustomPalette = (name: string, colors: string[]) => {
    const updated = { ...customPalettes, [name]: colors };
    setCustomPalettes(updated);
    localStorage.setItem("customPalettes", JSON.stringify(updated));
  }
  const handlePaletteChange = (v: string) => {
    setPaletteSelection(v)
    if (v.startsWith("custom:")) {
      updateParameter("colorPalette", customPalettes[v.slice(7)])
    } else {
      updateParameter("colorPalette", v)
    }
  }

  const handleCustomBackgroundChange = (
    key: "primary" | "secondary",
    value: string,
  ) => {
    setCustomBackground((prev) => {
      const next = { ...prev, [key]: value }
      localStorage.setItem("customBackground", JSON.stringify(next))
      return next
    })
  }


  /* ---------- Drawing Helpers ---------- */


  const drawArt = useCallback(
    (time?: number) => {
      const currentTime = time ?? 0
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Background - adjust for zoom level to ensure complete coverage
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Calculate the effective canvas size considering zoom
      const effectiveWidth = canvas.width / zoomLevel
      const effectiveHeight = canvas.height / zoomLevel
      
      const bgColors = allBackgroundColors[parameters.backgroundColor] || allBackgroundColors.dark
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(effectiveWidth, effectiveHeight) / 2,
      )
      gradient.addColorStop(0, bgColors.primary)
      gradient.addColorStop(1, bgColors.secondary)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create default audio data
      const audioData: AudioData = { volume: 0, frequency: 0 }

      // Pattern
      switch (parameters.pattern) {
        case "circles":
          drawCirclePattern(ctx, currentTime, parameters, audioData)
          break
        case "triangles":
          drawTrianglePattern(ctx, currentTime, parameters, audioData)
          break
        case "lines":
          drawLinePattern(ctx, currentTime, parameters, audioData)
          break
        case "stars":
          drawStarPattern(ctx, currentTime, parameters)
          break
        case "spiral":
          drawSpiral(ctx, currentTime, parameters, audioData)
          break
        case "fractal":
          drawFractal(ctx, currentTime, parameters)
          break
      }
    },
    [parameters, zoomLevel],
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
    const patterns = ["circles", "triangles", "lines", "stars", "spiral", "fractal"]
    const paletteKeys = [
      ...Object.keys(colorPalettes),
      ...Object.keys(customPalettes).map((n) => `custom:${n}`),
    ]
    const backgroundOptions = Object.keys(backgroundColors)
    const fractalTypes = ["mandelbrot", "julia", "sierpinski", "koch", "dragon", "mandala"]

    const paletteChoice = paletteKeys[Math.floor(Math.random() * paletteKeys.length)]
    let palette: string | string[] = paletteChoice
    setPaletteSelection(paletteChoice)
    if (paletteChoice.startsWith("custom:")) {
      palette = customPalettes[paletteChoice.slice(7)]
    }

    setParameters({
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      colorPalette: palette,
      shapeCount: Math.floor(Math.random() * 100) + 20,
      shapeSize: Math.floor(Math.random() * 40) + 10,
      animationSpeed: Number((Math.random() * 3 + 0.5).toFixed(1)),
      rotationSpeed: Number((Math.random() * 3 + 0.5).toFixed(1)),
      opacity: Number((Math.random() * 0.5 + 0.3).toFixed(2)),
      complexity: Math.floor(Math.random() * 5) + 1,
      isAnimated: Math.random() > 0.3,
      audioReactive: false,
      backgroundColor: backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)],
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
    const data = canvas.toDataURL()
    link.href = data
    link.click()
    const item: GalleryItem = {
      id: Date.now().toString(),
      type: 'png',
      dataURL: data,
      parameters,
      timestamp: Date.now(),
    }
    addItem(item)
  }

  /* ---------- GIF Recording ---------- */

  const saveGif = async () => {
    if (!gifReady || recording || !parameters.isAnimated) return

    const canvas = canvasRef.current
    const GIF = window.GIF
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
      const reader = new FileReader()
      reader.onload = () => {
        const item: GalleryItem = {
          id: Date.now().toString(),
          type: 'gif',
          dataURL: reader.result as string,
          parameters,
          timestamp: Date.now(),
        }
        addItem(item)
        URL.revokeObjectURL(url)
        setRecording(false)
      }
      reader.readAsDataURL(blob)
    })

    gif.render()
  }

  /* ---------- Video Recording ---------- */
  const saveVideo = async () => {
    if (videoRecording || !parameters.isAnimated) return

    const canvas = canvasRef.current
    if (!canvas) return

    const stream = canvas.captureStream(30)
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
    })

    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `algorithmic-art-${Date.now()}.webm`
      link.click()
      URL.revokeObjectURL(url)
      setVideoRecording(false)
    }

    const frames = 150
    const delay = 33 // ~30 FPS
    let captured = 0
    setVideoProgress(0)
    setVideoRecording(true)
    recorder.start()

    const capture = setInterval(() => {
      drawArt(performance.now() + captured * delay)
      captured++
      setVideoProgress(Math.round((captured / frames) * 100))
      if (captured >= frames) {
        clearInterval(capture)
        recorder.stop()
      }
    }, delay)
  }

  const toggleFullscreen = () => {
    const elem = boardRef.current
    if (!elem) return
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  /* ---------- JSX ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Algorithmic Art Generator</h1>
          <p className="text-slate-300">Create beautiful generative art with customizable parameters</p>
          <Link href="/gallery" className="text-blue-400 underline">
            View Gallery
          </Link>
        </header>

        <div
          ref={boardRef}
          className={cn(
            "gap-6",
            isFullscreen ? "grid grid-cols-1" : "grid grid-cols-1 lg:grid-cols-4"
          )}
        >
          {/* Control Panel */}
          <aside className={cn("lg:col-span-1 space-y-4", isFullscreen && "order-last") }>
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
                      <SelectItem value="stars">Stars</SelectItem>
                      <SelectItem value="spiral">Spiral</SelectItem>
                      <SelectItem value="fractal">Fractal</SelectItem>
                  </SelectContent>
                  </Select>
                  {parameters.backgroundColor === "custom" && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={customBackground.primary}
                        onChange={(e) =>
                          handleCustomBackgroundChange("primary", e.target.value)
                        }
                        className="h-8 w-8 p-0 border-none bg-transparent"
                      />
                      <input
                        type="color"
                        value={customBackground.secondary}
                        onChange={(e) =>
                          handleCustomBackgroundChange("secondary", e.target.value)
                        }
                        className="h-8 w-8 p-0 border-none bg-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Palette */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Color Palette</Label>
                  <Select value={paletteSelection} onValueChange={handlePaletteChange}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                      {Object.keys(colorPalettes).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </SelectItem>
                      ))}
                      {Object.keys(customPalettes).map((key) => (
                        <SelectItem key={`custom:${key}`} value={`custom:${key}`}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ColorPaletteEditor onSave={saveCustomPalette} />
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Background Color</Label>
                  <Select value={parameters.backgroundColor} onValueChange={(v) => updateParameter("backgroundColor", v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {Object.keys(backgroundColors).map((key) => {
                        const bgColor = backgroundColors[key]
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border border-slate-600"
                                style={{ 
                                  background: `linear-gradient(45deg, ${bgColor.primary} 0%, ${bgColor.secondary} 100%)` 
                                }}
                              />
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </div>
                          </SelectItem>
                        )
                      })}
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

                {/* Zoom Slider */}
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Zoom: {zoomLevel.toFixed(2).replace(/\.00$/, "")}
                  </Label>
                  <Slider
                    value={[zoomLevel]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={([v]) => setZoomLevel(v)}
                    className="[&_[role=slider]]:bg-blue-500"
                  />
                </div>

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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="audioReactive"
                    checked={parameters.audioReactive}
                    onCheckedChange={(c) => updateParameter("audioReactive", c)}
                  />
                  <Label htmlFor="audioReactive" className="text-slate-300">
                    Audio Reactive
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

                {parameters.isAnimated && (
                  <Button
                    onClick={saveVideo}
                    disabled={videoRecording}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-60"
                  >
                    {videoRecording ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Film className="w-4 h-4 mr-2" />
                    )}
                    {videoRecording ? `Recording Video… ${videoProgress}%` : "Save Video"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Canvas */}
          <section className="lg:col-span-3">
            <Card
              className={cn(
                "relative bg-slate-800 border-slate-700 h-[600px] lg:h-[800px]",
                isFullscreen && "h-full"
              )}
            >
              <Button
                onClick={toggleFullscreen}
                size="icon"
                variant="outline"
                className="absolute top-2 right-2 z-10 bg-slate-700 text-white hover:bg-slate-600"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                <span className="sr-only">Toggle Fullscreen</span>
              </Button>
              <CardContent className="p-0 h-full overflow-auto flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full rounded-lg"
                  style={{ display: "block", transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
                />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
