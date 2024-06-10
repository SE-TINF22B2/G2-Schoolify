
import type { NextRequest } from "next/server";
import {cookies} from "next/headers";
export function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;

    if (!session && !request.nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL("/login", request.url));
    }
    if (session && request.nextUrl.pathname.startsWith("/login")) {
      return Response.redirect(new URL("/", request.url));
  }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
