import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";

import ProductVariantModel from "@/models/ProductVariantModel";

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
      product: true,
      isDefaultVariant: true,
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

    const getProductVariant = await ProductVariantModel.findOne({
      deletedAt: null,
      _id: productVariantData._id,
    });
    if (!getProductVariant) {
      return response(false, 404, "Data not found");
    }

    if (productVariantData.isDefaultVariant) {
      const productVariants = await ProductVariantModel.findOne({
        deletedAt: null,
        isDefaultVariant: true,
        product: productVariantData.product,
      });
      if (productVariants) {
        return response(
          false,
          400,
          "Default Varient Already use you can check all product variants"
        );
      }
    }

    getProductVariant.product = productVariantData.product;
    getProductVariant.isDefaultVariant = productVariantData.isDefaultVariant;
    getProductVariant.weight = productVariantData.weight;
    getProductVariant.cream = productVariantData.cream;
    getProductVariant.flavour = productVariantData.flavour;
    getProductVariant.dietary = productVariantData.dietary;
    getProductVariant.mrp = productVariantData.mrp;
    getProductVariant.sellingPrice = productVariantData.sellingPrice;
    getProductVariant.discountPercentage =
      productVariantData.discountPercentage;

    await getProductVariant.save();

    return response(true, 200, "product variant updated successfully");
  } catch (error) {
    return catchError(error);
  }
};
