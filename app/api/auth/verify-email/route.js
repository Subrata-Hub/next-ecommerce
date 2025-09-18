import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/UserModel";
import { jwtVerify } from "jose";

export const POST = async (request) => {
  try {
    await connectDB();
    const { token } = await request.json();

    if (!token) {
      return response(false, 401, "Missing Token");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;

    // get user
    const user = await UserModel.findById(userId);
    if (!user) {
      return response(false, 404, "user not found");
    }

    user.isEmailVerified = true;

    await user.save();
    return response(true, 200, "Email verification Successful");
  } catch (error) {
    return catchError(error);
  }
};
