import { NextResponse } from "next/server";

export function middleware(req) {
  // Retrieve the seller_auth_token from cookies
  const sellerAuthToken = req.cookies.get("seller_auth_token");
  const userAuthToken = req.cookies.get("user_auth_token");

  // Get the current path
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/cart") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/userwhishlist")
  ) {
    if (!userAuthToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/password-reset")
  ) {
    if (userAuthToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // If the seller is trying to access the dashboard
  if (pathname.startsWith("/seller/dashboard")) {
    // If token is not available, redirect to login
    if (!sellerAuthToken) {
      return NextResponse.redirect(new URL("/seller/login", req.url));
    }
    // If token is available, allow access
    return NextResponse.next();
  }

  // If the user is trying to access login or signup
  if (
    pathname.startsWith("/seller/login") ||
    pathname.startsWith("/seller/signup")
  ) {
    // If token is available, redirect to dashboard
    if (sellerAuthToken) {
      return NextResponse.redirect(new URL("/seller/dashboard", req.url));
    }
    // If token is not available, allow access
    return NextResponse.next();
  }

  // Allow access to other routes (e.g., public pages)
  return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
  matcher: [
    "/seller/dashboard/:path*",
    "/seller/login",
    "/seller/signup",
    "/signup",
    "/login",
    "/password-reset",
    "/cart/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/userwhishlist/:path*",
  ],
};
