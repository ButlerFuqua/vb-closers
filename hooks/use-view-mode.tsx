"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type ViewMode = "excel" | "grid" | "list"

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

const ViewModeContext = createContext<ViewModeContextType>({
  viewMode: "excel",
  setViewMode: () => {},
})

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>("excel")

  // Get view mode from cookies
  const getViewModeFromCookie = (): ViewMode => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";")
      const viewModeCookie = cookies.find((cookie) => cookie.trim().startsWith("vb-closers-view-mode="))
      if (viewModeCookie) {
        const value = viewModeCookie.split("=")[1] as ViewMode
        return ["excel", "grid", "list"].includes(value) ? value : "excel"
      }
    }
    return "excel"
  }

  // Set view mode in cookies
  const setViewModeCookie = (newMode: ViewMode) => {
    if (typeof document !== "undefined") {
      document.cookie = `vb-closers-view-mode=${newMode}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
    }
  }

  const setViewMode = (newMode: ViewMode) => {
    setViewModeState(newMode)
    setViewModeCookie(newMode)
  }

  // Initialize view mode on mount
  useEffect(() => {
    const savedMode = getViewModeFromCookie()
    setViewModeState(savedMode)
  }, [])

  return <ViewModeContext.Provider value={{ viewMode, setViewMode }}>{children}</ViewModeContext.Provider>
}

export const useViewMode = () => {
  const context = useContext(ViewModeContext)
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider")
  }
  return context
}
