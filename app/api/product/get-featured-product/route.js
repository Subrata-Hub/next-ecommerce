import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";
import MediaModel from "@/models/MediaModel";

export const GET = async (request) => {
  try {
    await connectDB();
    const getAllProducts = await ProductModel.find({ deletedAt: null })
      .populate("media", "_id secure_url")
      .limit(8)
      .lean();

    if (!getAllProducts) {
      return response(false, 404, "products not found");
    }
    return response(true, 200, "product found", getAllProducts);
  } catch (error) {
    return catchError(error);
  }
};
