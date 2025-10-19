import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/CouponModel";

export const PUT = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }

    await connectDB();

    const payload = await request.json();

    const schema = credentialsSchema.pick({
      _id: true,
      code: true,
      discountPercentage: true,
      minShoppingAmount: true,
      validity: true,
    });
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const couponData = validate.data;

    const getCoupon = await CouponModel.findOne({
      deletedAt: null,
      _id: couponData._id,
    });
    if (!getCoupon) {
      return response(false, 404, "Data not found");
    }

    getCoupon.code = couponData.code;
    getCoupon.minShoppingAmount = couponData.minShoppingAmount;
    getCoupon.discountPercentage = couponData.discountPercentage;
    getCoupon.validity = couponData.validity;

    await getCoupon.save();

    return response(true, 200, "coupon updated successfully");
  } catch (error) {
    return catchError(error);
  }
};
