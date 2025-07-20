export const colorPalettes = {
  sunset: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
  ocean: ["#0077BE", "#00A8CC", "#7FB3D3", "#C5E4FD", "#E8F4FD"],
  forest: ["#2D5016", "#61892F", "#86C232", "#C6E377", "#E8F5E8"],
  cosmic: ["#2C1810", "#5D4E75", "#B19CD9", "#C9A9DD", "#E6E6FA"],
  fire: ["#8B0000", "#DC143C", "#FF4500", "#FF6347", "#FFA07A"],
  monochrome: ["#000000", "#404040", "#808080", "#C0C0C0", "#FFFFFF"],
} as const;

export const backgroundColors = {
  dark: { primary: "#1a1a2e", secondary: "#16213e" },
  light: { primary: "#f8f9fa", secondary: "#e9ecef" },
  sunset: { primary: "#2c1810", secondary: "#4a1c1c" },
  ocean: { primary: "#0a1929", secondary: "#1e3a8a" },
  forest: { primary: "#1a2e1a", secondary: "#2d5016" },
  cosmic: { primary: "#1a1a2e", secondary: "#2c1810" },
  fire: { primary: "#2c1810", secondary: "#4a1c1c" },
  custom: { primary: "#1a1a2e", secondary: "#16213e" },
} as const;

export type PaletteKey = keyof typeof colorPalettes;
