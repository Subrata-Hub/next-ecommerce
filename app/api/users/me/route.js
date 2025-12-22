import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";

import UserModel from "@/models/UserModel";
import mongoose from "mongoose";

export const GET = async (request) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    // We cast to String() here to ensure we are checking the HEX string, not an object
    if (!mongoose.Types.ObjectId.isValid(String(auth.userId))) {
      return response(false, 400, "Invalid User ID");
    }

    // silencing the "deprecated" warning and handling both String/Object inputs safely.
    const userId = new mongoose.Types.ObjectId(String(auth.userId));

    const matchQuery = {
      deletedAt: null,
      _id: userId,
    };

    const aggregatePipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "carts",
          localField: "_id",
          foreignField: "userId",
          as: "cart",
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "_id",
          foreignField: "userId",
          as: "address",
        },
      },

      {
        $lookup: {
          from: "favourites",
          localField: "_id",
          foreignField: "userId",
          as: "favourites",
        },
      },

      {
        $project: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          date_of_brith: 1,
          date_of_anniversary: 1,
          avatar: 1,
          cart: 1,
          address: 1,
          favourites: 1,
        },
      },
    ];

    const user = await UserModel.aggregate(aggregatePipeline);

    if (!user || user.length === 0) {
      return response(false, 404, "user not found");
    }
    return response(true, 200, "user found successfully", user);
  } catch (error) {
    return catchError(error);
  }
};
