import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connectDB } from "./databaseconnection";
import UserModel from "@/models/UserModel";
export const isAuthenticated = async (role) => {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) {
      return {
        isAuth: false,
      };
    }

    const access_token = cookieStore.get("access_token");
    // const { payload } = await jwtVerify(
    //   access_token.value,
    //   new TextEncoder().encode(process.env.SECRET_KEY)
    // );

    const decoded = await jwtVerify(
      access_token.value,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    //  const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;
    if (decoded.payload.role !== role) {
      return {
        isAuth: false,
      };
    }

    await connectDB();

    const user = await UserModel.findById(userId);

    return {
      isAuth: true,
      userId: user._id,
    };
  } catch (error) {
    return {
      isAuth: false,
      error,
    };
  }
};
