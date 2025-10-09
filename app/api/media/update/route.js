import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/MediaModel";
import { isValidObjectId } from "mongoose";

export const PUT = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();

    const payload = await request.json();

    const schema = credentialsSchema.pick({
      _id: true,
      alt: true,
      title: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(
        false,
        403,
        "Invalid id or missing field",
        validate.error
      );
    }

    const { _id, alt, title } = validate.data;
    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid object id");
    }

    const getMedia = await MediaModel.findById(_id);

    if (!getMedia) {
      return response(false, 404, "Media not found");
    }

    getMedia.alt = alt;
    getMedia.title = title;

    await getMedia.save();

    return response(true, 200, "media updated successfully");
  } catch (error) {
    return catchError(error);
  }
};
