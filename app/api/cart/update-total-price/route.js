import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import CartModel from "@/models/CartModel";
import CouponModel from "@/models/CouponModel";

export const POST = async (request) => {
  try {
    await connectDB();
    const schema = credentialsSchema.pick({
      code: true,
      cartId: true,
    });

    const payload = await request.json();

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const { data } = validate;
    const code = data.code;
    const cartId = data.cartId;

    if (!code || !cartId) {
      return response(false, 401, "Coupon code or CardId not found");
    }

    const filter = {
      deletedAt: null,
    };

    filter.code = code;

    const getCoupon = await CouponModel.findOne(filter).lean();

    if (!getCoupon) {
      return response(false, 401, "Coupon not found");
    }

    if (getCoupon.validity < Date.now()) {
      return response(
        false,
        401,
        `Coupon Expired on ${getCoupon.validity.toDateString()}`
      );
    }

    const getCart = await CartModel.findById(cartId);

    if (!getCart) {
      return response(false, 404, "Cart not found");
    }

    if (getCart.total < getCoupon.minShoppingAmount) {
      return response(
        false,
        401,
        `Minimum Shopping Amount ${getCoupon.minShoppingAmount}`
      );
    }

    const updatedDiscount =
      (getCart.total * getCoupon.discountPercentage) / 100;

    getCart.total = getCart.total - updatedDiscount;

    getCart.totalDiscount = getCart.totalDiscount + updatedDiscount;

    await getCart.save();

    return response(true, 200, "Coupon Applied successfully", getCoupon);
  } catch (error) {
    return catchError(error);
  }
};
