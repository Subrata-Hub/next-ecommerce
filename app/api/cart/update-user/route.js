import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import AddressModel from "@/models/AddressModel";
import CartModel from "@/models/CartModel";
import z from "zod";

export const POST = async (request) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }
    await connectDB();

    const schema = credentialsSchema.pick({
      cartId: true,
    });

    const payload = await request.json();
    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid field data");
    }

    const { cartId } = validate.data;

    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return response(false, 404, "Cart not found");
    }

    cart.userId = auth.userId;

    await cart.save();
    return response(true, 200, "cart updated successfully");
  } catch (error) {
    return catchError(error);
  }
};
