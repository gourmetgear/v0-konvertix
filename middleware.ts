import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Authentication completely disabled - no redirects
  return
}

export const config = {
  matcher: [],
}
