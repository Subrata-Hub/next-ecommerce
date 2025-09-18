import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { credentialsSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/OptModel";
import UserModel from "@/models/UserModel";

export const POST = async (request) => {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = credentialsSchema.pick({
      email: true,
    });
    const validationData = validationSchema.safeParse(payload);
    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validationData.error
      );
    }

    const { email } = validationData.data;

    const getUser = await UserModel.findOne({ email });
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // Remove old otps
    await OTPModel.deleteMany({ email });
    const otp = generateOTP();
    const newOtpData = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();

    const otpSendStatus = await sendMail(
      "Your login verification code",
      email,
      otpEmail(otp)
    );
    if (!otpSendStatus.success) {
      return response(false, 404, "Failed to resend OTP");
    }
    return response(true, 200, "OTP send successfully");
  } catch (error) {
    return catchError(error);
  }
};
