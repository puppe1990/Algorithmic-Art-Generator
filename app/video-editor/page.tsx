"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VideoEditorPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [recording, setRecording] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)

  // Start webcam stream
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        video.play()
      }
    })
  }, [])

  const startRecording = () => {
    const video = videoRef.current
    if (!video || recording) return
    const stream = (video as HTMLVideoElement).captureStream()
    const recorder = new MediaRecorder(stream)
    chunksRef.current = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `recording-${Date.now()}.webm`
      link.click()
      URL.revokeObjectURL(url)
      setRecording(false)
    }
    recorder.start()
    mediaRecorderRef.current = recorder
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
  }

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Video Editor</h1>
          <p className="text-slate-300">Adjust settings while recording</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <aside className="space-y-4 md:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-300">Brightness: {brightness}%</label>
                  <Slider
                    value={[brightness]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={([v]) => setBrightness(v)}
                    className="[&_[role=slider]]:bg-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300">Contrast: {contrast}%</label>
                  <Slider
                    value={[contrast]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={([v]) => setContrast(v)}
                    className="[&_[role=slider]]:bg-blue-500"
                  />
                </div>
                {recording ? (
                  <Button onClick={stopRecording} className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Stop Recording
                  </Button>
                ) : (
                  <Button onClick={startRecording} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Start Recording
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>
          <section className="md:col-span-2 flex items-center justify-center">
            <video ref={videoRef} style={filterStyle} className="rounded-lg w-full" />
          </section>
        </div>
      </div>
    </div>
  )
}

