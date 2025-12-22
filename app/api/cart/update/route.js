import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import AddressModel from "@/models/AddressModel";
import CartModel from "@/models/CartModel";
import z from "zod";

export const POST = async (requext) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }
    await connectDB();

    const schema = credentialsSchema
      .pick({
        cartId: true,
      })
      .extend({
        addressId: z.string().min("3", "addressId field is required"),
      });

    const payload = await requext.json();
    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid field data");
    }

    const { addressId, cartId } = validate.data;

    const getAddress = await AddressModel.findById(addressId).lean();

    if (!getAddress) {
      return response(false, 401, "Address not found");
    }

    const distance = getAddress.distance;

    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return response(false, 404, "Cart not found");
    }

    cart.userId = auth.userId;
    cart.addressId = getAddress._id;

    const delivery_fee_per_km = 10;
    const distance_km = Number((distance / 1000).toFixed(2));
    const delivery_fee = Math.round(distance_km * delivery_fee_per_km);

    cart.distance = distance_km;
    cart.delivery_fee = delivery_fee;

    const baseTotal = cart.subTotal - cart.totalDiscount;
    cart.total = baseTotal + delivery_fee;

    // cart.total = cart.total + distance_km * delivery_fee_per_km;

    await cart.save();
    return response(true, 200, "cart updated successfully");
  } catch (error) {
    return catchError(error);
  }
};
