import { connectDB } from "@/lib/databaseconnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/MediaModel";
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

    const getMedia = await MediaModel.findOne(filter).lean();

    if (!getMedia) {
      return response(false, 401, "Media not found");
    }

    return response(true, 200, "media found", getMedia);
  } catch (error) {
    return catchError(error);
  }
};
