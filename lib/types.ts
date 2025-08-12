export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  theme?: string
  view_mode?: string
}

export interface Sale {
  id: string
  user_id: string
  start_date_time: string
  closed_date_time: string
  amount: number
  commission_percentage: number
  approved_date?: string | null
  cancelled_date_time?: string | null
  finished_date_time?: string | null
  paid_out: boolean
  created_at: string
  updated_at: string
}
