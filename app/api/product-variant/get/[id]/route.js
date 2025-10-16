import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";

import { isValidObjectId } from "mongoose";

export const GET = async (request, { params }) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();

    const getParams = await params;
    const id = getParams.id;

    const filter = {
      deletedAt: null,
    };

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Object ID");
    }

    filter._id = id;

    const getProductVariant = await ProductVariantModel.findOne(filter).lean();

    if (!getProductVariant) {
      return response(false, 401, "product variant not found");
    }

    return response(true, 200, "product variant  found", getProductVariant);
  } catch (error) {
    return catchError(error);
  }
};
