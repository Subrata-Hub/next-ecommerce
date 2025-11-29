// import { catchError } from "@/lib/helperFunction";

import { catchError, response } from "@/lib/helperFunction";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const cookieStore = await cookies();

    if (!cookieStore.has("access_token")) {
      return response(false, 403, "unauthorized");
    }

    const token = cookieStore.get("access_token").value;

    try {
      const decoded = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.SECRET_KEY)
      );

      return response(true, 200, "user is valid", decoded.payload);
    } catch (err) {
      if (err.code === "ERR_JWT_EXPIRED" || err.name === "JWTExpired") {
        return response(false, 403, "token expired");
      }

      return response(false, 403, "invalid token");
    }
  } catch (error) {
    return catchError(error);
  }
};
