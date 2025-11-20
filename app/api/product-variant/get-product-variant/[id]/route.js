import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";

import ProductModel from "@/models/ProductModel";
import ProductVariantModel from "@/models/ProductVariantModel";
import mongoose from "mongoose";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return response(false, 400, "Invalid ID");

    const weight = searchParams.get("weight");
    const flavour = searchParams.get("flavour");
    const cream = searchParams.get("cream");
    const dietary = searchParams.get("dietary");
    const variantId = searchParams.get("variantId");

    // Dynamic filter
    const filterOption = { product: id };
    if (weight) filterOption.weight = { $in: [Number(weight)] };
    if (flavour) filterOption.flavour = { $in: [flavour] };
    if (cream) filterOption.cream = { $in: [cream] };
    if (dietary) filterOption.dietary = { $in: [dietary] };
    if (variantId) filterOption._id = variantId;

    const Productvariant = await ProductVariantModel.findOne(
      filterOption
    ).lean();

    return response(
      true,
      200,
      "Products Variant found for this product",
      Productvariant
    );
  } catch (error) {
    return catchError(error);
  }
};
