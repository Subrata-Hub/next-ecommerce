import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { credentialsSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/OptModel";
import UserModel from "@/models/UserModel";
import { SignJWT } from "jose";
import z from "zod";

export const POST = async (request) => {
  try {
    await connectDB();
    const payload = await request.json();

    const validationSchema = credentialsSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    const validateData = validationSchema.safeParse(payload);

    if (!validateData.success) {
      return response(
        false,
        401,
        "Invalid or missing field",
        validateData.error
      );
    }

    const { email, password } = validateData.data;

    // get user Data
    const getUser = await UserModel.findOne({ email, deletedAt: null }).select(
      "+password"
    );
    if (!getUser) {
      return response(false, 404, "Invalid login credintials");
    }

    // resend email verification link
    // if (!getUser.isEmailVerified) {
    //   const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    //   const token = await new SignJWT({ userId: getUser._id.toString() })
    //     .setIssuedAt()
    //     .setExpirationTime("1h")
    //     .setProtectedHeader({ alg: "HS256" })
    //     .sign(secret);

    //   await sendMail(
    //     "Email verification Link from Next-Ecommerce",
    //     email,
    //     emailVerificationLink(
    //       `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
    //     )
    //   );

    //   return response(
    //     false,
    //     401,
    //     "your email not verified. we have sens verification link to your registered email address "
    //   );
    // }

    // password verification

    const isPasswordVerified = await getUser.comparePassword(password);

    if (!isPasswordVerified) {
      return response(false, 400, "Invalid login credintial");
    }

    // Opt generation
    await OTPModel.deleteMany({ email });

    const otp = generateOTP();
    //  Storing otm into database
    const newOtpData = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();

    const otpEmailStatus = await sendMail(
      "Your login verification code",
      email,
      otpEmail(otp)
    );
    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to send otp");
    }
    return response(true, 200, "please verify your device");
  } catch (error) {
    return catchError(error);
  }
};
