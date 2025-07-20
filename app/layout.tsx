import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Algorithmic Art Generator',
  description: 'Create beautiful generative algorithmic art with customizable parameters',
  generator: 'Algorithmic Art Generator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
