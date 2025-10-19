import { isAuthenticated } from "@/lib/authentication";

import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/ReviewModel";

export const PUT = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();
    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list");
    }

    const data = await ReviewModel.find({ _id: { $in: ids } }).lean();
    if (!data.length) {
      return response(false, 404, "Data not found");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation.Delete type should be SD or RSD for this route"
      );
    }

    if (deleteType === "SD") {
      await ReviewModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    } else {
      await ReviewModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }

    return response(
      true,
      200,
      deleteType === "SD" ? "Data move into trash" : "Data restore"
    );
  } catch (error) {
    return catchError(error);
  }
};

export const DELETE = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();
    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list");
    }

    const data = await ReviewModel.find({ _id: { $in: ids } }).lean();
    if (!data.length) {
      return response(false, 404, "Data not found");
    }

    if (!deleteType === "PD") {
      return response(
        false,
        400,
        "Invalid delete operation.Delete type should be PD for this route"
      );
    }

    await ReviewModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data Deleted Permantly");
  } catch (error) {
    return catchError(error);
  }
};
