import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/CouponModel";

export const POST = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }

    await connectDB();

    const payload = await request.json();

    const schema = credentialsSchema.pick({
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

    const newCoupon = new CouponModel({
      code: couponData.code,
      minShoppingAmount: couponData.minShoppingAmount,
      discountPercentage: couponData.discountPercentage,
      validity: couponData.validity,
    });

    await newCoupon.save();

    return response(true, 200, "coupon added successfully");
  } catch (error) {
    return catchError(error);
  }
};
