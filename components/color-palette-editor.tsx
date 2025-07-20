"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPaletteEditorProps {
  onSave: (name: string, colors: string[]) => void
}

export default function ColorPaletteEditor({ onSave }: ColorPaletteEditorProps) {
  const [name, setName] = useState("")
  const [colors, setColors] = useState<string[]>([
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
  ])

  const handleColorChange = (index: number, value: string) => {
    setColors((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), colors)
    setName("")
  }

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">Palette Name</Label>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {colors.map((color, i) => (
          <input
            key={i}
            type="color"
            value={color}
            onChange={(e) => handleColorChange(i, e.target.value)}
            className="h-8 w-8 p-0 border-none bg-transparent"
          />
        ))}
      </div>
      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white w-full">
        Save Palette
      </Button>
    </div>
  )
}
