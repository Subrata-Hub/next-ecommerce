import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";

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

    const getProduct = await ProductModel.findOne(filter)
      .populate("media", "_id secure_url")
      .lean();

    if (!getProduct) {
      return response(false, 401, "Media not found");
    }

    return response(true, 200, "media found", getProduct);
  } catch (error) {
    return catchError(error);
  }
};
