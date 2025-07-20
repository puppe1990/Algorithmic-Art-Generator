"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getItems, removeItem, GalleryItem } from "@/lib/gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    setItems(getItems())
  }, [])

  const handleDelete = (id: string) => {
    removeItem(id)
    setItems(getItems())
  }

  const handleDownload = (item: GalleryItem) => {
    const link = document.createElement("a")
    link.href = item.dataURL
    link.download = `algorithmic-art-${item.id}.${item.type}`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gallery</h1>
          <p className="text-slate-300">Your saved artworks</p>
          <Link href="/" className="text-blue-400 underline">
            &larr; Back to generator
          </Link>
        </header>
        {items.length === 0 ? (
          <p className="text-center text-slate-300">No items saved yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="bg-slate-800 border-slate-700">
                <CardHeader className="p-2 pb-0">
                  <CardTitle className="text-base text-white">{new Date(item.timestamp).toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-2">
                  <img src={item.dataURL} alt="art" className="rounded" />
                  <div className="flex justify-between">
                    <Button size="sm" onClick={() => handleDownload(item)} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Download
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
