import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/ProductModel";
import { encode } from "entities";

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
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      media: true,
    });
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const productData = validate.data;

    const getProduct = await ProductModel.findOne({
      deletedAt: null,
      _id: productData._id,
    });
    if (!getProduct) {
      return response(false, 404, "Data not found");
    }

    getProduct.name = productData.name;
    getProduct.slug = productData.slug;
    getProduct.category = productData.category;
    getProduct.mrp = productData.mrp;
    getProduct.sellingPrice = productData.sellingPrice;
    getProduct.discountPercentage = productData.discountPercentage;
    getProduct.description = encode(productData.description);
    getProduct.media = productData.media;
    await getProduct.save();

    return response(true, 200, "product updated successfully");
  } catch (error) {
    return catchError(error);
  }
};
