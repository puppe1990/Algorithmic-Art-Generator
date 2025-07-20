# Project Structure

## Directory Organization

```
Algorithmic-Art-Generator/
├── app/                     # Next.js App Router
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main application page
├── components/             # React components
│   ├── gif-recorder.tsx    # GIF export functionality
│   ├── theme-provider.tsx  # Theme management wrapper
│   └── ui/                 # Shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
│   └── utils.ts           # Common utilities (cn function)
├── public/                 # Static assets
│   ├── gif.worker.js      # Web worker for GIF generation
│   └── placeholder-*      # Placeholder images
└── styles/                # Additional stylesheets
    └── globals.css        # Legacy global styles
```

## Key Architectural Patterns

### Component Organization
- **UI Components**: All Radix UI-based components in `components/ui/`
- **Feature Components**: Application-specific components in `components/`
- **Custom Hooks**: Reusable logic in `hooks/`
- **Utilities**: Helper functions in `lib/`

### File Naming Conventions
- **Components**: kebab-case (e.g., `gif-recorder.tsx`)
- **Hooks**: kebab-case with `use-` prefix (e.g., `use-mobile.tsx`)
- **Types**: PascalCase interfaces (e.g., `ArtParameters`)
- **Constants**: camelCase objects (e.g., `colorPalettes`)

### Import Patterns
- **Path Aliases**: Use `@/` for all internal imports
- **Component Imports**: Import UI components from `@/components/ui/`
- **Utility Imports**: Import `cn` from `@/lib/utils`
- **Hook Imports**: Import custom hooks from `@/hooks/`

### Code Organization in Components
1. **Imports** (external libraries first, then internal)
2. **Types & Constants** (interfaces, enums, constants)
3. **Component Definition** with clear sections:
   - State management
   - Event handlers
   - Effect hooks
   - Render helpers
   - JSX return

### Canvas Architecture
- **Main drawing function**: `drawArt()` orchestrates all rendering
- **Pattern functions**: Separate functions for each pattern type
- **Animation loop**: Uses `requestAnimationFrame` for smooth animation
- **Parameter reactivity**: All drawing functions use current parameters

### State Management
- **Local state**: useState for component-specific state
- **Parameter object**: Single state object for all art parameters
- **Refs**: useRef for canvas and animation frame references
- **Callbacks**: useCallback for performance optimization

## Configuration Files
- **components.json**: Shadcn/ui configuration
- **tailwind.config.ts**: Tailwind CSS configuration with custom theme
- **tsconfig.json**: TypeScript configuration with path aliases
- **next.config.mjs**: Next.js configuration with build optimizations