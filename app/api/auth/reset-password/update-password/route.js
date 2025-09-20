import { connectDB } from "@/lib/databaseconnection";
import { response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import UserModel from "@/models/UserModel";

export const PUT = async (request) => {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = credentialsSchema.pick({
      email: true,
      password: true,
    });
    const validateData = validationSchema.safeParse(payload);
    if (!validateData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validateData.error
      );
    }

    const { email, password } = validateData.data;
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );
    if (!getUser) {
      return response(false, 404, "user not found");
    }

    getUser.password = password;
    await getUser.save();

    return response(true, 200, "password update successful");
  } catch (error) {}
};
