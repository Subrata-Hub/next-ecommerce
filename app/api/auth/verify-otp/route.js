import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/OptModel";
import UserModel from "@/models/UserModel";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export const POST = async (request) => {
  try {
    connectDB();
    const payload = await request.json();
    const validationSchema = credentialsSchema.pick({
      otp: true,
      email: true,
    });

    const validateData = validationSchema.safeParse(payload);
    if (!validateData.success) {
      return response(
        false,
        401,
        "Invalid or messing input field",
        validateData.error
      );
    }

    const { email, otp } = validateData.data;

    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 401, "Invalid or expired otp");
    }

    const getUser = await UserModel.findOne({ deleteAt: null, email }).lean();
    if (!getUser) {
      return response(false, 404, "user not found");
    }

    const loggedinuserData = {
      _id: getUser._id,
      role: getUser.role,
      name: getUser.name,
      avater: getUser.avater,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedinuserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // remove OTP after validation
    await getOtpData.deleteOne();
    return response(true, 200, "login successfull", loggedinuserData);
  } catch (error) {
    return catchError(error);
  }
};
