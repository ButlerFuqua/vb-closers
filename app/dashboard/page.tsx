"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SalesForm } from "@/components/sales-form"
import { ViewModeSelector } from "@/components/view-mode-selector"
import { ExcelView } from "@/components/sales-views/excel-view"
import { GridView } from "@/components/sales-views/grid-view"
import { ListView } from "@/components/sales-views/list-view"
import { useViewMode } from "@/hooks/use-view-mode"
import { calculateUpcomingCommission } from "@/lib/commission-calculator"
import { DashboardParticles } from "@/components/dashboard-particles"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@supabase/supabase-js"
import { SlideoutMenu } from "@/components/slideout-menu"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Sale {
  id: string
  user_id: string
  start_date_time: string
  closed_date_time: string
  amount: number
  commission_percentage: number
  approved_date?: string
  cancelled_date_time?: string
  finished_date_time?: string
  paid_out: boolean
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const { viewMode } = useViewMode()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)

  useEffect(() => {
    console.log("🔍 Dashboard auth check:", { user: user?.email, authLoading })
    if (!authLoading && !user) {
      console.log("🚫 No user found, redirecting to login")
      router.push("/")
    }
  }, [user, authLoading, router])

  const fetchSales = async () => {
    try {
      console.log("📊 User authenticated, fetching sales")
      setLoading(true)
      setError(null)

      // Get the current session and access token
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("No access token available")
      }

      const response = await fetch("/api/sales", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch sales: ${response.status}`)
      }

      const data = await response.json()
      setSales(data)
      console.log("✅ Sales fetched successfully:", data.length, "sales")
    } catch (error) {
      console.error("❌ Sales fetch failed:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch sales")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && !authLoading) {
      fetchSales()
    }
  }, [user, authLoading])

  const createSale = async (saleData: Omit<Sale, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("No access token available")
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      })

      if (!response.ok) {
        throw new Error("Failed to create sale")
      }

      await fetchSales()
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error creating sale:", error)
      setError(error instanceof Error ? error.message : "Failed to create sale")
    }
  }

  const updateSale = async (id: string, saleData: Partial<Sale>) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("No access token available")
      }

      const response = await fetch(`/api/sales/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      })

      if (!response.ok) {
        throw new Error("Failed to update sale")
      }

      await fetchSales()
      setEditingSale(null)
    } catch (error) {
      console.error("Error updating sale:", error)
      setError(error instanceof Error ? error.message : "Failed to update sale")
    }
  }

  const markPaidOut = async (id: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("No access token available")
      }

      const response = await fetch(`/api/sales/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paid_out: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark as paid out")
      }

      await fetchSales()
    } catch (error) {
      console.error("Error marking as paid out:", error)
      setError(error instanceof Error ? error.message : "Failed to mark as paid out")
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const upcomingCommission = calculateUpcomingCommission(sales)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <DashboardParticles />

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-green-400">${upcomingCommission.toLocaleString()}</h1>
            </div>

            {/* Menu bar with slideout menu and add sale button */}
            <div className="flex items-center gap-4">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6">Add Sale</Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Sale</DialogTitle>
                  </DialogHeader>
                  <SalesForm onSubmit={createSale} />
                </DialogContent>
              </Dialog>

              <SlideoutMenu />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-red-900/50 border-red-700 text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* View Mode Selector */}
          <div className="mb-6">
            <ViewModeSelector />
          </div>

          {/* Sales Views */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading sales...</div>
            </div>
          ) : (
            <div>
              {viewMode === "excel" && <ExcelView sales={sales} onEdit={setEditingSale} onMarkPaidOut={markPaidOut} />}
              {viewMode === "grid" && <GridView sales={sales} onEdit={setEditingSale} onMarkPaidOut={markPaidOut} />}
              {viewMode === "list" && <ListView sales={sales} onEdit={setEditingSale} onMarkPaidOut={markPaidOut} />}
            </div>
          )}

          {/* Edit Sale Dialog */}
          <Dialog open={!!editingSale} onOpenChange={() => setEditingSale(null)}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Sale</DialogTitle>
              </DialogHeader>
              {editingSale && (
                <SalesForm initialData={editingSale} onSubmit={(data) => updateSale(editingSale.id, data)} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
