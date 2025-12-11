import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/UserModel";

export const GET = async (request) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    const userId = auth.userId;

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
        $project: {
          name: 1,
          email: 1,

          avatar: 1,
          cart: 1,
          address: 1,
        },
      },
    ];

    const user = await UserModel.aggregate(aggregatePipeline);

    if (!user) {
      return response(false, 404, "user not found");
    }
    return response(true, 200, "user found successfully", user);
  } catch (error) {
    return catchError(error);
  }
};
