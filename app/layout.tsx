import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { PWAInstaller } from "@/components/pwa-installer"
import { AuthProvider } from "@/hooks/use-auth"
import { ThemeProvider } from "@/hooks/use-theme"
import { ViewModeProvider } from "@/hooks/use-view-mode"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="icon" href="/vb-closers-logo.png" />
        <link rel="apple-touch-icon" href="/vb-closers-logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VB Closers" />
      </head>
      <body>
        <ThemeProvider>
          <ViewModeProvider>
            <AuthProvider>
              <PWAInstaller />
              {children}
            </AuthProvider>
          </ViewModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
    };
