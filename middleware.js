// import { NextResponse } from "next/server";
// import { USER_DASBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoutes";
// import { jwtVerify } from "jose";
// import { ADMIN_DASBOARD } from "./routes/AddminPanelRoutes";

// export const middleware = async (request) => {
//   try {
//     const pathname = request.nextUrl.pathname;
//     const hastoken = request.cookies.has("access_token");

//     if (!hastoken) {
//       if (!pathname.startswith("/auth")) {
//         return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
//       }

//       return NextResponse.next();
//     }

//     // verify token
//     const access_token = request.cookies.get("access_token").value;
//     const { payload } = await jwtVerify(
//       access_token,
//       new TextEncoder().encode(process.env.SECRET_KEY)
//     );
//     const role = payload.role;

//     if (pathname.startswith("/auth")) {
//       return NextResponse.redirect(
//         new URL(
//           role === "admin" ? ADMIN_DASBOARD : USER_DASBOARD,
//           request.nextUrl
//         )
//       );
//     }

//     // protect admin route
//     if (pathname.startswith("/admin") && role !== "admin") {
//       return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
//     }

//     // Protect user route
//     if (pathname.startswith("/my-account") && role !== "user") {
//       return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
//   }
// };

// export const config = {
//   matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
// };

import { NextResponse } from "next/server";
import { USER_DASBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoutes";
import { jwtVerify } from "jose";
import { ADMIN_DASBOARD } from "./routes/AddminPanelRoutes";

export const middleware = async (request) => {
  try {
    const pathname = request.nextUrl.pathname;
    const hasToken = request.cookies.has("access_token");

    // No token: allow auth routes, redirect others
    if (!hasToken) {
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
      }
      return NextResponse.next();
    }

    // Verify token
    const access_token = request.cookies.get("access_token").value;
    const { payload } = await jwtVerify(
      access_token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    const role = payload.role;

    // If user tries to visit auth page while logged in, redirect to their dashboard
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(role === "admin" ? ADMIN_DASBOARD : USER_DASBOARD, request.url)
      );
    }

    // Protect admin route
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    }

    // Protect user route
    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
  }
};

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};
