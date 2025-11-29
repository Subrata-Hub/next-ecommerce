import { connectDB } from "@/lib/databaseconnection";
import { response } from "@/lib/helperFunction";
import CartModel from "@/models/CartModel";

export const GET = async (request, { params }) => {
  try {
    await connectDB();
    const { id } = await params;
    console.log(id);

    // if (!isValidObjectId(id)) {
    //   return response(false, 400, "Invalid Object ID");
    // }

    const getCart = await CartModel.findById(id).lean();

    if (!getCart) {
      return response(false, 401, "Cart not found");
    }

    return response(true, 200, "Cart found", getCart);
  } catch (error) {
    return response(error);
  }
};
