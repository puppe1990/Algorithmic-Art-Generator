"use client"

import { useState, useEffect } from "react"

export interface AudioData {
  volume: number
  frequency: number
}

export default function useAudioInput(enabled: boolean): AudioData {
  const [data, setData] = useState<AudioData>({ volume: 0, frequency: 0 })

  useEffect(() => {
    if (!enabled) {
      setData({ volume: 0, frequency: 0 })
      return
    }

    const AudioCtx =
      (window as any).AudioContext || (window as any).webkitAudioContext
    let context: AudioContext
    let analyser: AnalyserNode
    let source: MediaStreamAudioSourceNode | undefined
    let rafId: number
    const dataArray: Uint8Array = new Uint8Array(256)

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        context = new AudioCtx()
        analyser = context.createAnalyser()
        analyser.fftSize = dataArray.length * 2
        source = context.createMediaStreamSource(stream)
        source.connect(analyser)

        const tick = () => {
          analyser.getByteFrequencyData(dataArray)
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
          const volume = avg / 255
          let maxIndex = 0
          for (let i = 1; i < dataArray.length; i++) {
            if (dataArray[i] > dataArray[maxIndex]) maxIndex = i
          }
          const frequency = maxIndex / dataArray.length
          setData({ volume, frequency })
          rafId = requestAnimationFrame(tick)
        }
        tick()
      })
      .catch((err) => {
        console.error("Audio input error", err)
      })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (source) source.disconnect()
      if (context) context.close()
    }
  }, [enabled])

  return data
}

