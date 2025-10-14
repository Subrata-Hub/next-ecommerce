import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";

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

    const getProduct = await ProductModel.find(filter)
      .select("-media -description")
      .sort({
        createdAt: -1,
      })
      .lean();
    if (!getProduct) {
      return response(false, 404, "Collection empty");
    }

    return response(true, 200, "data found", getProduct);
  } catch (error) {
    return catchError(error);
  }
};
