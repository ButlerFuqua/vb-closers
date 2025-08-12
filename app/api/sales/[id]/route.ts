import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set(name, value, options)
          },
          remove(name: string, options: any) {
            response.cookies.set(name, "", { ...options, maxAge: 0 })
          },
        },
      },
    )

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      nickname,
      startDateTime,
      closedDateTime,
      amount,
      commissionPercentage,
      approvedDate,
      cancelledDateTime,
      finishedDateTime,
      paidOut,
    } = body

    const { data: sale, error } = await supabase
      .from("sales")
      .update({
        nickname: nickname || null,
        start_date_time: new Date(startDateTime).toISOString(),
        closed_date_time: new Date(closedDateTime).toISOString(),
        amount: Number.parseFloat(amount),
        commission_percentage: Number.parseFloat(commissionPercentage),
        approved_date: approvedDate ? new Date(approvedDate).toISOString() : null,
        cancelled_date_time: cancelledDateTime ? new Date(cancelledDateTime).toISOString() : null,
        finished_date_time: finishedDateTime ? new Date(finishedDateTime).toISOString() : null,
        paid_out: Boolean(paidOut),
      })
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating sale:", error)
      return NextResponse.json({ error: "Failed to update sale" }, { status: 500 })
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Error updating sale:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set(name, value, options)
          },
          remove(name: string, options: any) {
            response.cookies.set(name, "", { ...options, maxAge: 0 })
          },
        },
      },
    )

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { paidOut } = body

    const { data: sale, error } = await supabase
      .from("sales")
      .update({ paid_out: Boolean(paidOut) })
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating sale paid status:", error)
      return NextResponse.json({ error: "Failed to update sale" }, { status: 500 })
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Error updating sale paid status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set(name, value, options)
          },
          remove(name: string, options: any) {
            response.cookies.set(name, "", { ...options, maxAge: 0 })
          },
        },
      },
    )

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("sales").delete().eq("id", params.id).eq("user_id", session.user.id)

    if (error) {
      console.error("Error deleting sale:", error)
      return NextResponse.json({ error: "Failed to delete sale" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sale:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
