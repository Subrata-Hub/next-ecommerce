import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";

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

    const getCategory = await CategoryModel.find(filter)
      .sort({
        createdAt: -1,
      })
      .lean();
    if (!getCategory) {
      return response(false, 404, "Collection empty");
    }

    return response(true, 200, "data found", getCategory);
  } catch (error) {
    return catchError(error);
  }
};
