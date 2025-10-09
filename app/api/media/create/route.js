import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/MediaModel";

export const POST = async (request) => {
  const payload = await request.json();

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();
    const newMedia = await MediaModel.insertMany(payload);
    return response(true, 200, "Media update Successful", newMedia);
  } catch (error) {
    if (payload && payload.length > 0) {
      const publicIds = payload.map((data) => data.public_id);
      try {
        await cloudinary.api.delete_resources(publicIds);
      } catch (deleteError) {
        error.cloudinary = deleteError;
      }
    }
    return catchError(error);
  }
};
