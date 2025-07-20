"use client"

import { useEffect, useState } from "react"

/**
 * Loads gif.js in the browser and returns a boolean once it’s ready.
 */
export function useGifJs() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if ((window as any).GIF) {
      setReady(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js"
    script.onload = () => setReady(true)
    document.head.appendChild(script)
  }, [])

  return ready
}
