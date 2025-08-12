interface Sale {
  id: string
  amount: number
  commissionPercentage: number
  closedDateTime: string
  cancelledDateTime?: string | null
  finishedDateTime?: string | null
  paidOut: boolean
}

export function calculateUpcomingCommission(sales: Sale[]): number {
  const now = new Date()
  const lastWednesday = getLastWednesday(now)

  let upcomingCommission = 0

  sales.forEach((sale) => {
    // Skip cancelled sales
    if (sale.cancelledDateTime) return

    const amount = Number(sale.amount) || 0
    const commissionPercentage = Number(sale.commissionPercentage) || 0

    if (amount <= 0 || commissionPercentage <= 0) return

    const commissionAmount = (amount * commissionPercentage) / 100

    // Half commission from sales closed on or before last Wednesday (not paid out)
    if (sale.closedDateTime) {
      const closedDate = new Date(sale.closedDateTime)
      if (!isNaN(closedDate.getTime()) && closedDate <= lastWednesday && !sale.paidOut) {
        upcomingCommission += commissionAmount / 2
      }
    }

    // Half commission from finished sales (not paid out)
    if (sale.finishedDateTime && !sale.paidOut) {
      const finishedDate = new Date(sale.finishedDateTime)
      if (!isNaN(finishedDate.getTime())) {
        upcomingCommission += commissionAmount / 2
      }
    }
  })

  return upcomingCommission
}

function getLastWednesday(date: Date): Date {
  const lastWednesday = new Date(date)
  const dayOfWeek = date.getDay()
  const daysToSubtract = dayOfWeek >= 3 ? dayOfWeek - 3 : dayOfWeek + 4
  lastWednesday.setDate(date.getDate() - daysToSubtract)
  lastWednesday.setHours(23, 59, 59, 999) // End of Wednesday
  return lastWednesday
}

export function getSalesStats(sales: Sale[]) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalSales = sales.filter((sale) => !sale.cancelledDateTime).length

  const thisMonthSales = sales.filter((sale) => {
    if (sale.cancelledDateTime) return false
    const closedDate = new Date(sale.closedDateTime)
    return !isNaN(closedDate.getTime()) && closedDate >= startOfMonth
  }).length

  const totalRevenue = sales
    .filter((sale) => !sale.cancelledDateTime)
    .reduce((sum, sale) => {
      const amount = Number(sale.amount) || 0
      return sum + amount
    }, 0)

  const totalCommission = sales
    .filter((sale) => !sale.cancelledDateTime)
    .reduce((sum, sale) => {
      const amount = Number(sale.amount) || 0
      const commissionPercentage = Number(sale.commissionPercentage) || 0
      return sum + (amount * commissionPercentage) / 100
    }, 0)

  return {
    totalSales,
    thisMonthSales,
    totalRevenue,
    totalCommission,
  }
}
