import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/OptModel";
import UserModel from "@/models/UserModel";

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

    // remove OTP after validation
    await getOtpData.deleteOne();
    return response(true, 200, "OTP Verified");
  } catch (error) {
    return catchError(error);
  }
};
