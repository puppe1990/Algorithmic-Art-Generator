import { ArtParameters } from './types'

export interface GalleryItem {
  id: string
  type: 'png' | 'gif'
  dataURL: string
  parameters: ArtParameters
  timestamp: number
}

const KEY = 'aag-gallery'

function load(): GalleryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as GalleryItem[]) : []
  } catch {
    return []
  }
}

function save(items: GalleryItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function addItem(item: GalleryItem) {
  const items = load()
  items.unshift(item)
  save(items)
}

export function getItems(): GalleryItem[] {
  return load()
}

export function removeItem(id: string) {
  const items = load().filter((i) => i.id !== id)
  save(items)
}
