import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type JwtUser = {
  id: string;
  role: "ADMIN" | "OPERATOR" | "PASSENGER";
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const path = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtUser;

    // ADMIN
    if (path.startsWith("/admin-dashboard") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // OPERATOR
    if (path.startsWith("/operator-dashboard") && decoded.role !== "OPERATOR") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // PASSENGER
    if (path.startsWith("/passenger-dashboard") && decoded.role !== "PASSENGER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();

  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/operator-dashboard/:path*",
    "/passenger-dashboard/:path*",
  ],
};

