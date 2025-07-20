export interface ArtParameters {
  pattern: string
  colorPalette: string | string[]
  shapeCount: number
  shapeSize: number
  animationSpeed: number
  rotationSpeed: number
  opacity: number
  complexity: number
  isAnimated: boolean
  audioReactive: boolean
  backgroundColor: string
  fractalType: string
  fractalIterations: number
  fractalScale: number
  fractalAngle: number
}

export interface AudioData {
  volume: number
  frequency: number
}
