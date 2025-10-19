import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";
import ProductModel from "@/models/ProductModel";
import UserModel from "@/models/UserModel";

export const GET = async () => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();
    const [category, product, customer] = await Promise.all([
      CategoryModel.countDocuments({ deletedAt: null }),
      ProductModel.countDocuments({ deletedAt: null }),
      UserModel.countDocuments({ deletedAt: null }),
    ]);

    return response(true, 200, "Dashboard count", {
      category,
      product,
      customer,
    });
  } catch (error) {
    return catchError(error);
  }
};
