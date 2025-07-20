# Technology Stack

## Framework & Runtime
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Node.js 18+** required

## Styling & UI
- **Tailwind CSS 3.4.17** for utility-first styling
- **Radix UI** components for accessible, unstyled primitives
- **Lucide React** for icons
- **next-themes** for theme management
- **CSS Variables** for theming with HSL color system

## Key Libraries
- **Canvas API** for art generation and animation
- **gif.js** for animated GIF export
- **clsx + tailwind-merge** for conditional styling
- **class-variance-authority** for component variants
- **React Hook Form + Zod** for form handling and validation

## Development Tools
- **TypeScript 5** with strict mode enabled
- **ESLint** for code linting
- **PostCSS** with Autoprefixer
- **pnpm** as preferred package manager

## Build Configuration
- **Build errors ignored** for TypeScript and ESLint during builds
- **Images unoptimized** in Next.js config
- **Path aliases** configured with `@/*` pointing to root

## Common Commands

### Development
```bash
pnpm dev          # Start development server on localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Package Management
```bash
pnpm install      # Install dependencies
pnpm add <pkg>    # Add new dependency
pnpm add -D <pkg> # Add dev dependency
```

## Browser APIs Used
- **Canvas 2D Context** for drawing operations
- **requestAnimationFrame** for smooth animations
- **Web Workers** (via gif.js) for GIF generation
- **File Download API** for export functionality