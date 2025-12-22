import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/UserModel";
import { authSchema } from "@/zodSchema/authSchema";
import mongoose from "mongoose";

export const POST = async (request) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();

    // We cast to String() here to ensure we are checking the HEX string, not an object
    if (!mongoose.Types.ObjectId.isValid(String(auth.userId))) {
      return response(false, 400, "Invalid User ID");
    }

    // silencing the "deprecated" warning and handling both String/Object inputs safely.
    const userId = new mongoose.Types.ObjectId(String(auth.userId));

    const schema = authSchema.pick({
      name: true,
      email: true,
      phoneNumber: true,
      date_of_brith: true,
      date_of_anniversary: true,
    });

    const payload = await request.json();

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      // ✅ FIX 2: Console log the specific error so you know WHICH field failed
      console.log("Zod Validation Errors:", validate.error.format());

      return response(false, 400, "Invalid or missing field", {
        errors: validate.error.flatten().fieldErrors,
      });
    }

    const { name, email, phoneNumber, date_of_brith, date_of_anniversary } =
      validate.data;

    const updateUser = {
      name,
      email,
      phoneNumber,
      date_of_brith,
      date_of_anniversary,
    };

    await UserModel.findByIdAndUpdate(userId, updateUser, {
      new: true,
      runValidators: true,
    });
    return response(true, 200, "User Profile Updated Successfully");
  } catch (error) {
    return catchError(error);
  }
};
