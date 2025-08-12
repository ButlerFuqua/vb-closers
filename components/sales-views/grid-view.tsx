"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, DollarSign, Calendar, TrendingUp } from "lucide-react"
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

interface GridViewProps {
  sales: Sale[]
  onUpdateSale: (id: string, sale: any) => Promise<void>
  onMarkPaidOut: (id: string) => Promise<void>
}

export function GridView({ sales, onUpdateSale, onMarkPaidOut }: GridViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sales.map((sale) => {
        const commission = getCommission(sale.amount, sale.commissionPercentage)

        return (
          <Card key={sale.id} className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{sale.nickname || "Untitled Sale"}</CardTitle>{" "}
              {/* Use nickname as main title */}
              <p className="text-sm text-muted-foreground">{formatCurrency(sale.amount)}</p>{" "}
              {/* Moved amount to subtitle */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Started</p>
                    <p className="font-medium">{formatDate(sale.startDateTime)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Closed</p>
                    <p className="font-medium">{formatDate(sale.closedDateTime)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Commission</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(commission)} ({sale.commissionPercentage}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
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
                    Mark Paid
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
