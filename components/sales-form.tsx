"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"

interface Sale {
  id?: string
  nickname?: string // Added optional nickname field
  startDateTime: string
  closedDateTime: string
  amount: number
  commissionPercentage: number
  approvedDate?: string | null
  cancelledDateTime?: string | null
  finishedDateTime?: string | null
  paidOut?: boolean
}

interface SalesFormProps {
  sale?: Sale
  onSubmit: (sale: Omit<Sale, "id">) => Promise<void>
  onCancel: () => void
  trigger?: React.ReactNode
}

export function SalesForm({ sale, onSubmit, onCancel, trigger }: SalesFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Sale, "id">>({
    nickname: sale?.nickname || "", // Added nickname to form data
    startDateTime: sale?.startDateTime || new Date().toISOString().slice(0, 16),
    closedDateTime: sale?.closedDateTime || new Date().toISOString().slice(0, 16),
    amount: sale?.amount || 0,
    commissionPercentage: sale?.commissionPercentage || 10,
    approvedDate: sale?.approvedDate || null,
    cancelledDateTime: sale?.cancelledDateTime || null,
    finishedDateTime: sale?.finishedDateTime || null,
    paidOut: sale?.paidOut || false,
  })

  const calculateCommission = () => {
    return (formData.amount * formData.commissionPercentage) / 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
      setOpen(false)
      // Reset form if creating new sale
      if (!sale) {
        setFormData({
          nickname: "", // Reset nickname field
          startDateTime: new Date().toISOString().slice(0, 16),
          closedDateTime: new Date().toISOString().slice(0, 16),
          amount: 0,
          commissionPercentage: 10,
          approvedDate: null,
          cancelledDateTime: null,
          finishedDateTime: null,
          paidOut: false,
        })
      }
    } catch (error) {
      console.error("Error submitting sale:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Sale
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sale ? "Edit Sale" : "Add New Sale"}</DialogTitle>
          <DialogDescription>
            {sale ? "Update the sale information below." : "Enter the details for your new sale."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname (Optional)</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="Enter a nickname for this sale"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">A friendly name to identify this sale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date Time */}
            <div className="space-y-2">
              <Label htmlFor="startDateTime">Start Date & Time</Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Initial call or appointment</p>
            </div>

            {/* Closed Date Time */}
            <div className="space-y-2">
              <Label htmlFor="closedDateTime">Closed Date & Time</Label>
              <Input
                id="closedDateTime"
                type="datetime-local"
                value={formData.closedDateTime}
                onChange={(e) => setFormData({ ...formData, closedDateTime: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">When customer decided to buy</p>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Sale Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Commission Percentage */}
            <div className="space-y-2">
              <Label htmlFor="commissionPercentage">Commission (%)</Label>
              <Input
                id="commissionPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.commissionPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, commissionPercentage: Number.parseFloat(e.target.value) || 10 })
                }
                required
              />
            </div>

            {/* Approved Date */}
            <div className="space-y-2">
              <Label htmlFor="approvedDate">Approved Date (Optional)</Label>
              <Input
                id="approvedDate"
                type="date"
                value={formData.approvedDate ? formData.approvedDate.split("T")[0] : ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    approvedDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>

            {/* Finished Date Time */}
            <div className="space-y-2">
              <Label htmlFor="finishedDateTime">Finished Date & Time (Optional)</Label>
              <Input
                id="finishedDateTime"
                type="datetime-local"
                value={formData.finishedDateTime ? formData.finishedDateTime.slice(0, 16) : ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    finishedDateTime: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>

            {/* Cancelled Date Time */}
            <div className="space-y-2">
              <Label htmlFor="cancelledDateTime">Cancelled Date & Time (Optional)</Label>
              <Input
                id="cancelledDateTime"
                type="datetime-local"
                value={formData.cancelledDateTime ? formData.cancelledDateTime.slice(0, 16) : ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cancelledDateTime: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>

            {/* Paid Out */}
            {sale && (
              <div className="space-y-2">
                <Label htmlFor="paidOut">Paid Out</Label>
                <div className="flex items-center space-x-2">
                  <input
                    id="paidOut"
                    type="checkbox"
                    checked={formData.paidOut}
                    onChange={(e) => setFormData({ ...formData, paidOut: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="paidOut" className="text-sm">
                    Mark as paid out
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Commission Calculation */}
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-700 dark:text-green-300">Commission Calculation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${calculateCommission().toFixed(2)}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                {formData.commissionPercentage}% of ${formData.amount.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sale ? "Update Sale" : "Create Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
