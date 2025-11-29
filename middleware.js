import { NextResponse } from "next/server";
import { USER_DASBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoutes";
import { jwtVerify } from "jose";
import { ADMIN_DASBOARD } from "./routes/AddminPanelRoutes";

export const middleware = async (request) => {
  const { pathname } = request.nextUrl;

  try {
    const hasToken = request.cookies.has("access_token");

    // 1. NO TOKEN HANDLING
    if (!hasToken) {
      // If trying to access protected routes, redirect to login
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
      }
      // If valid public auth route, allow
      return NextResponse.next();
    }

    // 2. TOKEN VERIFICATION
    const access_token = request.cookies.get("access_token").value;
    const { payload } = await jwtVerify(
      access_token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    const role = payload.role;

    // 3. AUTH ROUTE HANDLING (Logged in users shouldn't see Login/Register)
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(
          role === "admin" ? ADMIN_DASBOARD : USER_DASBOARD,
          request.nextUrl
        )
      );
    }

    // 4. ROLE PROTECTION
    // Protect Admin Routes
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    // Protect User Routes
    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    // CRITICAL FIX: Token is invalid/expired.
    // We must force the browser to DELETE the cookie,
    // otherwise, it will loop infinitely if the user is on an /auth page.

    console.log(error);

    const response = NextResponse.redirect(
      new URL(WEBSITE_LOGIN, request.nextUrl)
    );

    // Delete the bad cookie so the next request is treated as "No Token"
    response.cookies.delete("access_token");

    return response;
  }
};

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
  runtime: "nodejs",
};
