import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { credentialsSchema } from "@/lib/zodSchema";
import UserModel from "@/models/UserModel";
import { SignJWT } from "jose";

export const POST = async (req) => {
  try {
    await connectDB();
    const validationSchema = credentialsSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await req.json();
    const validateData = validationSchema.safeParse(payload);

    if (!validateData.success) {
      return response(
        FaLeaf,
        401,
        "invalid or messing input field",
        validationSchema.error
      );
    }

    const { name, email, password } = validateData.data;

    // check already registered user
    const checkuser = await UserModel.exists({ email });
    if (checkuser) {
      return response(true, 409, "User already resistered");
    }

    // new registation
    const newRegistation = new UserModel({
      name,
      email,
      password,
    });
    await newRegistation.save();

    // const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    // const token = await new SignJWT({ userId: newRegistation._id.toString() })
    //   .setIssuedAt()
    //   .setExpirationTime("1h")
    //   .setProtectedHeader({ alg: "HS256" })
    //   .sign(secret);

    // await sendMail(
    //   "Email verification Link from Next-Ecommerce",
    //   email,
    //   emailVerificationLink(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
    //   )
    // );

    // return response(
    //   true,
    //   200,
    //   "Resistation success,Please verify your email address"
    // );

    return response(true, 200, "Resistation successfull,Please login");
  } catch (error) {
    catchError(error);
    console.log(error);
  }
};
