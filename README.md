# Algorithmic Art Generator

A beautiful, interactive web application for creating generative algorithmic art with real-time parameter controls and export capabilities.
<img width="1563" height="945" alt="Screenshot 2025-07-20 at 00 06 01" src="https://github.com/user-attachments/assets/aae31b16-4346-4c7d-9fd9-8cd287652cf2" />

![Algorithmic Art Generator](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **Real-time Art Generation**: Create beautiful algorithmic patterns with live preview
- **Multiple Pattern Types**: Circles, triangles, lines, and spiral patterns
- **Customizable Color Palettes**: 6 pre-defined color schemes (sunset, ocean, forest, cosmic, fire, monochrome)
- **Interactive Controls**: Adjust shape count, size, animation speed, rotation, opacity, and complexity
- **Animation Support**: Toggle between static and animated art
- **Export Options**: Save as PNG (static) or animated GIF
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Radix UI components and Tailwind CSS

## 🎨 Pattern Types

### Circles
Dynamic circular patterns that rotate and pulse with customizable parameters.

### Triangles
Rotating triangular shapes that create geometric compositions.

### Lines
Radial line patterns that extend from the center with animated rotation.

### Spiral
Spiral patterns that expand outward with smooth animation.

## 🎨 Color Palettes

- **Sunset**: Warm oranges, teals, and yellows
- **Ocean**: Cool blues and cyan tones
- **Forest**: Natural greens and earth tones
- **Cosmic**: Deep purples and lavender
- **Fire**: Hot reds and oranges
- **Monochrome**: Classic black, white, and grays

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Algorithmic-Art-Generator.git
   cd Algorithmic-Art-Generator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎛️ Usage

### Basic Controls

1. **Pattern Selection**: Choose from circles, triangles, lines, or spiral patterns
2. **Color Palette**: Select from 6 different color schemes
3. **Shape Count**: Adjust the number of shapes (10-200)
4. **Shape Size**: Control the size of individual shapes (5-50)
5. **Animation Speed**: Set the speed of pattern movement (0.1-5)
6. **Rotation Speed**: Control rotation speed (0.1-5)
7. **Opacity**: Adjust transparency (0.1-1)
8. **Complexity**: Modify pattern complexity (1-8)

### Advanced Features

- **Randomize**: Click the shuffle button to generate random parameters
- **Animation Toggle**: Enable/disable animation with the play/pause button
- **Export PNG**: Save the current frame as a PNG image
- **Export GIF**: Create an animated GIF (3 seconds, 20 FPS)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Animation**: Canvas API with requestAnimationFrame
- **GIF Generation**: gif.js library

## 📁 Project Structure

```
Algorithmic-Art-Generator/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application page
├── components/
│   ├── gif-recorder.tsx     # GIF export functionality
│   ├── theme-provider.tsx   # Theme management
│   └── ui/                  # Reusable UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── public/                  # Static assets
└── styles/                  # Additional stylesheets
```

## 🎯 Key Components

### Main Application (`app/page.tsx`)
The core application that handles:
- Canvas rendering and animation
- Parameter management
- Pattern generation algorithms
- Export functionality

### GIF Recorder (`components/gif-recorder.tsx`)
Custom hook for loading and managing gif.js library for animated GIF export.

### UI Components (`components/ui/`)
Comprehensive set of accessible UI components built with Radix UI primitives.

## 🔧 Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Adding New Patterns

To add a new pattern type:

1. Add the pattern name to the `ArtParameters` interface
2. Create a new drawing function (e.g., `drawNewPattern`)
3. Add the pattern to the switch statement in `drawArt`
4. Update the pattern selection UI

### Adding New Color Palettes

To add a new color palette:

1. Add the palette to the `colorPalettes` object
2. The UI will automatically include it in the selection dropdown

## 🎨 Customization

### Modifying Patterns
Each pattern function accepts a canvas context and time parameter. You can modify the mathematical formulas to create new variations.

### Adding Effects
The canvas API provides many possibilities for additional effects:
- Gradients and shadows
- Blend modes
- Filters and transformations

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (responsive design)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [gif.js](https://github.com/buzzfeed/libgif-js) for GIF generation
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy creating! 🎨✨**
