import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(_request: NextRequest) {
  return NextResponse.redirect(new URL('/', _request.url))
}

export const config = {
  matcher: '/user/:path*',
}
