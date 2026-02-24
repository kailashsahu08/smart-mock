import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth is handled client-side via AuthContext (localStorage JWT).
// This middleware is a passthrough — no server-side route protection needed.
export function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [], // No routes intercepted
};
