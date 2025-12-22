import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import FavouriteModel from "@/models/FavouriteModel";
import ProductModel from "@/models/ProductModel";
import ProductVariantModel from "@/models/ProductVariantModel";
import mongoose from "mongoose";

export const POST = async (request) => {
  try {
    const auth = await isAuthenticated("user");

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(String(auth.userId))) {
      return response(false, 400, "Invalid User ID");
    }

    const userId = new mongoose.Types.ObjectId(String(auth.userId));

    const schema = credentialsSchema.pick({
      productId: true,
      publicUserId: true,
    });

    const payload = await request.json();

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const { productId, publicUserId } = validate.data;

    const matchQuery = {
      deletedAt: null,
      _id: new mongoose.Types.ObjectId(String(productId)),
    };

    const aggregatePipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "medias",
          localField: "media",
          foreignField: "_id",
          as: "media",
        },
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },

      {
        $addFields: {
          weights: { $setUnion: "$variants.weight" },
          flavours: { $setUnion: "$variants.flavour" },
          creams: { $setUnion: "$variants.cream" },
          dietarys: { $setUnion: "$variants.dietary" },
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          media: {
            _id: 1,
            secure_url: 1,
            alt: 1,
          },
          weights: 1,
          flavours: 1,
          creams: 1,
          dietarys: 1,

          variants: {
            _id: 1,
            weight: 1,
            flavour: 1,
            cream: 1,
            dietary: 1,
            isDefaultVariant: 1,
            mrp: 1,
            sellingPrice: 1,
            discountPercentage: 1,
          },
        },
      },
    ];

    const product = await ProductModel.aggregate(aggregatePipeline);
    if (!product || product.length === 0) {
      return response(false, 404, "Product not found");
    }

    const singleProduct = product[0];
    singleProduct._id = singleProduct._id.toString();

    const favouriteParoducts = await FavouriteModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: { publicUserId: publicUserId }, // Set User ID
        $push: { products: singleProduct }, // Push the ACTUAL product object
      },
      { new: true, upsert: true } // Create doc if it doesn't exist
    );

    // const favouriteParoducts = {
    //   userId,
    //   publicUserId,
    //   products: [...product],
    // };

    return response(
      true,
      200,
      "Added to favorite successfully",
      favouriteParoducts
    );
  } catch (error) {
    return catchError(error);
  }
};
