import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/CouponModel";

export const GET = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();

    const filter = {
      deletedAt: null,
    };

    const getCoupon = await CouponModel.find(filter)

      .sort({
        createdAt: -1,
      })
      .lean();
    if (!getCoupon) {
      return response(false, 404, "Collection empty");
    }

    return response(true, 200, "data found", getCoupon);
  } catch (error) {
    return catchError(error);
  }
};
