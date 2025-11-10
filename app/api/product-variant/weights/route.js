import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    // Find category by name
    const getWeigts = await ProductVariantModel.distinct("weight");

    if (!getWeigts) {
      return response(false, 404, "Category not found");
    }

    return response(true, 200, "Products for this category found", getWeigts);
  } catch (error) {
    return catchError(error);
  }
};
