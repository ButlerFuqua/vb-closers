"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  // Get theme from cookies
  const getThemeFromCookie = (): Theme => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";")
      const themeCookie = cookies.find((cookie) => cookie.trim().startsWith("vb-closers-theme="))
      if (themeCookie) {
        const value = themeCookie.split("=")[1] as Theme
        return ["light", "dark", "system"].includes(value) ? value : "system"
      }
    }
    return "system"
  }

  // Set theme in cookies
  const setThemeCookie = (newTheme: Theme) => {
    if (typeof document !== "undefined") {
      document.cookie = `vb-closers-theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
    }
  }

  // Get system theme
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  }

  // Resolve theme (convert system to actual theme)
  const resolveTheme = (currentTheme: Theme): "light" | "dark" => {
    if (currentTheme === "system") {
      return getSystemTheme()
    }
    return currentTheme
  }

  // Apply theme to document
  const applyTheme = (resolvedTheme: "light" | "dark") => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(resolvedTheme)
    }
  }

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setThemeCookie(newTheme)
    const resolved = resolveTheme(newTheme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = getThemeFromCookie()
    const resolved = resolveTheme(savedTheme)
    setThemeState(savedTheme)
    setResolvedTheme(resolved)
    applyTheme(resolved)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (savedTheme === "system") {
        const newResolved = getSystemTheme()
        setResolvedTheme(newResolved)
        applyTheme(newResolved)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
