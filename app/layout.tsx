import React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GymBruhh",
  description: "🚀 Next.js 14 + TailwindCSS PWA fitness tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GymBro",
  },
  icons: {
    icon: "/placeholder-logo.png",
    apple: "/placeholder-logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0ea5a4",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="apple-touch-startup-image" href="/placeholder.png" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
