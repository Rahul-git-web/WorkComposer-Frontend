import { NextResponse } from "next/server";

export function middleware(request) {
const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith("/authenticate");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");


  if (!accessToken && isDashboard) {
    return NextResponse.redirect(
      new URL("/authenticate/login", request.url)
    );
  }


  if (accessToken && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/authenticate/:path*"],
};