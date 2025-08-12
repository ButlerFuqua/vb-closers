import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Disabled middleware auth - handling client-side instead
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
