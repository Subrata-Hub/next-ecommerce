import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import AddressModel from "@/models/AddressModel";
import CartModel from "@/models/CartModel";
import mongoose from "mongoose";

export const DELETE = async (request, { params }) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "Anauthorize");
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(String(auth.userId))) {
      return response(false, 400, "invalid userId");
    }

    // const userId = new mongoose.Types.ObjectId.isValid(String(auth.userId));
    const userId = auth.userId;
    const { id: addressId } = await params;

    // const payload = await request.json();

    if (!mongoose.Types.ObjectId.isValid(String(addressId))) {
      return response(false, 400, "invalid addressId");
    }

    const cart = await CartModel.findOne({
      userId: userId,
    });

    if (!cart) {
      return response(false, 404, "Cart not found");
    }

    console.log(cart.addressId);
    console.log(addressId);

    if (cart.addressId && cart.addressId.toString() === addressId) {
      cart.distance = 0;
      cart.delivery_fee = 0;
      const baseTotal = cart.subTotal - cart.totalDiscount;
      cart.total = baseTotal;

      cart.save();
    }

    // const addressId = payload.addressId;

    const deletedAddress = await AddressModel.findOneAndDelete({
      _id: addressId,
      userId: userId,
    });
    if (!deletedAddress) {
      return response(false, 404, "Address not found or unauthorized");
    }

    return response(true, 200, "Address deleted Successfully");
  } catch (error) {
    return catchError(error);
  }
};
