import { jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { connectDB } from "./databaseconnection";
import UserModel from "@/models/UserModel";

export const isAuthenticated = async (role) => {
  try {
    // CRITICAL CHANGE: These MUST be awaited in Next.js 15+
    const headerList = await headers();
    const cookieStore = await cookies();

    let token = null;

    // Authorization header (API / server-to-server)
    const authHeader = headerList.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Cookie fallback (browser)
    if (!token) {
      // Helper to handle both Next.js 14 (sync) and 15 (async) structures safely
      token = cookieStore.get("access_token")?.value ?? null;
    }

    if (!token) return { isAuth: false };

    //  Verify Token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    if (role && payload.role !== role) {
      return { isAuth: false };
    }

    await connectDB();

    // Fetch User (Optimized)
    const user = await UserModel.findById(payload.userId)
      .select("_id role")
      .lean(); // 🔥 Great usage of lean() for performance

    if (!user) return { isAuth: false };

    return {
      isAuth: true,
      userId: user._id,
    };
  } catch (error) {
    // This catch block effectively silences build errors, which is good.
    return { isAuth: false };
  }
};
