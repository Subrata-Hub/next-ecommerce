import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";

import UserModel from "@/models/UserModel";

export const GET = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();

    const filter = {
      deletedAt: null,
    };

    const getCustomer = await UserModel.find(filter)

      .sort({
        createdAt: -1,
      })
      .lean();
    if (!getCustomer) {
      return response(false, 404, "Collection empty");
    }

    return response(true, 200, "data found", getCustomer);
  } catch (error) {
    return catchError(error);
  }
};
