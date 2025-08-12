"use client"

import { Button } from "@/components/ui/button"
import { Edit, DollarSign, Calendar } from "lucide-react"
import { SalesForm } from "@/components/sales-form"

interface Sale {
  id: string
  nickname?: string // Added optional nickname field
  startDateTime: string
  closedDateTime: string
  amount: number
  commissionPercentage: number
  approvedDate?: string | null
  cancelledDateTime?: string | null
  finishedDateTime?: string | null
  paidOut: boolean
  createdAt: string
  updatedAt: string
}

interface ListViewProps {
  sales: Sale[]
  onUpdateSale: (id: string, sale: any) => Promise<void>
  onMarkPaidOut: (id: string) => Promise<void>
}

export function ListView({ sales, onUpdateSale, onMarkPaidOut }: ListViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCommission = (amount: number, percentage: number) => {
    return (amount * percentage) / 100
  }

  if (sales.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No sales found. Add your first sale to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sales.map((sale) => {
        const commission = getCommission(sale.amount, sale.commissionPercentage)

        return (
          <div key={sale.id} className="border rounded-lg p-4 hover:bg-muted/25 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold">{sale.nickname || "Untitled Sale"}</h3>{" "}
                  {/* Use nickname as main title */}
                  <p className="text-sm text-muted-foreground">{formatCurrency(sale.amount)} Sale</p>{" "}
                  {/* Moved amount to subtitle */}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(commission)}</p>
                  <p className="text-sm text-muted-foreground">{sale.commissionPercentage}% Commission</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <span className="ml-2 font-medium">{formatDate(sale.startDateTime)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Closed:</span>
                  <span className="ml-2 font-medium">{formatDate(sale.closedDateTime)}</span>
                </div>
              </div>
            </div>

            {(sale.approvedDate || sale.finishedDateTime || sale.cancelledDateTime) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                {sale.approvedDate && (
                  <div>
                    <span className="text-muted-foreground">Approved:</span>
                    <span className="ml-2">{formatDate(sale.approvedDate)}</span>
                  </div>
                )}
                {sale.finishedDateTime && (
                  <div>
                    <span className="text-muted-foreground">Finished:</span>
                    <span className="ml-2">{formatDate(sale.finishedDateTime)}</span>
                  </div>
                )}
                {sale.cancelledDateTime && (
                  <div>
                    <span className="text-muted-foreground">Cancelled:</span>
                    <span className="ml-2">{formatDate(sale.cancelledDateTime)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end space-x-2">
              <SalesForm
                sale={{
                  id: sale.id,
                  nickname: sale.nickname, // Added nickname to sale form
                  startDateTime: sale.startDateTime?.slice(0, 16) || "",
                  closedDateTime: sale.closedDateTime?.slice(0, 16) || "",
                  amount: sale.amount,
                  commissionPercentage: sale.commissionPercentage,
                  approvedDate: sale.approvedDate,
                  cancelledDateTime: sale.cancelledDateTime,
                  finishedDateTime: sale.finishedDateTime,
                  paidOut: sale.paidOut,
                }}
                onSubmit={(updatedSale) => onUpdateSale(sale.id, updatedSale)}
                onCancel={() => {}}
                trigger={
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                }
              />
              {!sale.paidOut && !sale.cancelledDateTime && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkPaidOut(sale.id)}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Mark Paid Out
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
