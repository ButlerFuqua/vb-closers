"use client"

import { Button } from "@/components/ui/button"
import { useViewMode } from "@/hooks/use-view-mode"
import { Table, Grid3X3, List } from "lucide-react"

export function ViewModeSelector() {
  const { viewMode, setViewMode } = useViewMode()

  return (
    <div className="flex items-center space-x-1 border rounded-lg p-1">
      <Button
        variant={viewMode === "excel" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("excel")}
        className="h-8"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("grid")}
        className="h-8"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("list")}
        className="h-8"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
