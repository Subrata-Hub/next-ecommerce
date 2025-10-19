import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";

import ProductVariantModel from "@/models/ProductVariantModel";

export const POST = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }

    await connectDB();

    const payload = await request.json();

    const schema = credentialsSchema.pick({
      product: true,
      weight: true,

      cream: true,
      flavour: true,
      dietary: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const productVariantData = validate.data;

    const productVariants = await ProductVariantModel.findOne({
      product: productVariantData.product,
    });
    if (productVariants) {
      return response(false, 400, "Product already used for variant");
    }

    const newProductVariant = new ProductVariantModel({
      product: productVariantData.product,
      weight: productVariantData.weight,

      cream: productVariantData.cream,
      flavour: productVariantData.flavour,
      dietary: productVariantData.dietary,
      mrp: productVariantData.mrp,
      sellingPrice: productVariantData.sellingPrice,
      discountPercentage: productVariantData.discountPercentage,
    });

    await newProductVariant.save();

    return response(true, 200, "product variant added successfully");
  } catch (error) {
    return catchError(error);
  }
};
