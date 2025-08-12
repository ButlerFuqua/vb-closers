"use client"

import { Button } from "@/components/ui/button"
import { Edit, DollarSign } from "lucide-react"
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

interface ExcelViewProps {
  sales: Sale[]
  onUpdateSale: (id: string, sale: any) => Promise<void>
  onMarkPaidOut: (id: string) => Promise<void>
}

export function ExcelView({ sales, onUpdateSale, onMarkPaidOut }: ExcelViewProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid Date"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number | null | undefined) => {
    const validAmount = Number(amount) || 0
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(validAmount)
  }

  const getCommission = (amount: number | null | undefined, percentage: number | null | undefined) => {
    const validAmount = Number(amount) || 0
    const validPercentage = Number(percentage) || 0
    return (validAmount * validPercentage) / 100
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {" "}
          {/* Added min-width for mobile scrolling */}
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="sticky left-0 bg-muted/50 z-10 text-left p-3 font-medium border-r">Actions</th>{" "}
              {/* Made actions column sticky and first */}
              <th className="sticky left-[120px] bg-muted/50 z-10 text-left p-3 font-medium border-r">Nickname</th>{" "}
              {/* Added sticky nickname column */}
              <th className="text-left p-3 font-medium">Start Date</th>
              <th className="text-left p-3 font-medium">Closed Date</th>
              <th className="text-right p-3 font-medium">Amount</th>
              <th className="text-right p-3 font-medium">Commission %</th>
              <th className="text-right p-3 font-medium">Commission $</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-muted-foreground">
                  {" "}
                  {/* Updated colspan for new columns */}
                  No sales found. Add your first sale to get started!
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                return (
                  <tr key={sale.id} className="border-b hover:bg-muted/25">
                    <td className="sticky left-0 bg-background z-10 p-3 border-r">
                      {" "}
                      {/* Made actions cell sticky */}
                      <div className="flex items-center justify-center space-x-2">
                        <SalesForm
                          sale={{
                            id: sale.id,
                            nickname: sale.nickname, // Added nickname to sale form
                            startDateTime: sale.startDateTime?.slice(0, 16) || "",
                            closedDateTime: sale.closedDateTime?.slice(0, 16) || "",
                            amount: Number(sale.amount) || 0,
                            commissionPercentage: Number(sale.commissionPercentage) || 10,
                            approvedDate: sale.approvedDate,
                            cancelledDateTime: sale.cancelledDateTime,
                            finishedDateTime: sale.finishedDateTime,
                            paidOut: sale.paidOut,
                          }}
                          onSubmit={(updatedSale) => onUpdateSale(sale.id, updatedSale)}
                          onCancel={() => {}}
                          trigger={
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        {!sale.paidOut && !sale.cancelledDateTime && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkPaidOut(sale.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="sticky left-[120px] bg-background z-10 p-3 text-sm font-medium border-r">
                      {" "}
                      {/* Added sticky nickname cell */}
                      {sale.nickname || "Untitled Sale"}
                    </td>
                    <td className="p-3 text-sm">{formatDate(sale.startDateTime)}</td>
                    <td className="p-3 text-sm">{formatDate(sale.closedDateTime)}</td>
                    <td className="p-3 text-sm text-right font-medium">{formatCurrency(sale.amount)}</td>
                    <td className="p-3 text-sm text-right">{Number(sale.commissionPercentage) || 0}%</td>
                    <td className="p-3 text-sm text-right font-medium text-green-600">
                      {formatCurrency(getCommission(sale.amount, sale.commissionPercentage))}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
