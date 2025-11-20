import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/CouponModel";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const getParams = await params;
    const code = getParams.code;

    if (!code) {
      return response(false, 400, "Code not found");
    }

    const filter = {
      deletedAt: null,
    };

    filter.code = code;

    const getCoupon = await CouponModel.findOne(filter).lean();

    if (!getCoupon) {
      return response(false, 401, "Coupon not found");
    }

    return response(true, 200, "coupon found", getCoupon);
  } catch (error) {
    return catchError(error);
  }
};
