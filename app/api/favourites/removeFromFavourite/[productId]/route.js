import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import FavouriteModel from "@/models/FavouriteModel";
import mongoose from "mongoose";

export const DELETE = async (request, { params }) => {
  try {
    const auth = await isAuthenticated("user");

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(String(auth.userId))) {
      return response(false, 400, "Invalid User ID");
    }

    const userId = new mongoose.Types.ObjectId(String(auth.userId));

    const { productId } = await params;

    if (!productId) {
      return response(false, 400, "Product ID is required");
    }

    const updatedFavourites = await FavouriteModel.findOneAndUpdate(
      { userId: userId },
      {
        $pull: {
          products: { _id: productId }, // Matches the _id string inside the array
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedFavourites) {
      return response(false, 404, "Favourite list not found");
    }

    return response(
      true,
      200,
      "Removed from favorites successfully",
      updatedFavourites
    );
  } catch (error) {
    return catchError(error);
  }
};
