import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API: Starting sales fetch request")

    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      console.log("❌ API: No authorization token found")
      return NextResponse.json({ error: "Please log in again" }, { status: 401 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get() {
            return undefined
          },
          set() {},
          remove() {},
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("❌ API: Invalid token or user not found:", userError)
      return NextResponse.json({ error: "Please log in again" }, { status: 401 })
    }

    console.log("✅ API: Authenticated user:", user.id)
    console.log("🔍 API: Querying sales for user:", user.id)

    const { data: sales, error } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ API: Error fetching sales:", error)
      return NextResponse.json({ error: "Failed to fetch sales", details: error.message }, { status: 500 })
    }

    const mappedSales =
      sales?.map((sale) => ({
        id: sale.id,
        nickname: sale.nickname, // Added nickname field mapping
        startDateTime: sale.start_date_time,
        closedDateTime: sale.closed_date_time,
        amount: sale.amount,
        commissionPercentage: sale.commission_percentage,
        approvedDate: sale.approved_date,
        cancelledDateTime: sale.cancelled_date_time,
        finishedDateTime: sale.finished_date_time,
        paidOut: sale.paid_out,
        createdAt: sale.created_at,
        updatedAt: sale.updated_at,
      })) || []

    console.log("✅ API: Successfully fetched", mappedSales.length, "sales for user")
    return NextResponse.json(mappedSales)
  } catch (error) {
    console.error("❌ API: Error fetching sales:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Please log in again" }, { status: 401 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get() {
            return undefined
          },
          set() {},
          remove() {},
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("No valid user found:", userError)
      return NextResponse.json({ error: "Please log in again" }, { status: 401 })
    }

    const body = await request.json()
    const { nickname, startDateTime, closedDateTime, amount, commissionPercentage, approvedDate, finishedDateTime } =
      body // Added nickname to destructuring

    const { data: sale, error } = await supabase
      .from("sales")
      .insert({
        user_id: user.id,
        nickname: nickname || null, // Added nickname field to insert
        start_date_time: new Date(startDateTime).toISOString(),
        closed_date_time: new Date(closedDateTime || startDateTime).toISOString(),
        amount: Number.parseFloat(amount),
        commission_percentage: Number.parseFloat(commissionPercentage || "10"),
        approved_date: approvedDate ? new Date(approvedDate).toISOString() : null,
        finished_date_time: finishedDateTime ? new Date(finishedDateTime).toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating sale:", error)
      return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Error creating sale:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
