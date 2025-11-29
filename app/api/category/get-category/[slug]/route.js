import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { slug } = await params;

    // Find category by name
    const getCategory = await CategoryModel.findOne({
      slug,
      deletedAt: null,
    }).lean();

    if (!getCategory) {
      return response(false, 404, "Category not found");
    }

    return response(true, 200, "category found", getCategory);
  } catch (error) {
    return catchError(error);
  }
};
