import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";
import MediaModel from "@/models/MediaModel";
import mongoose from "mongoose";
import ReviewModel from "@/models/ReviewModel";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { slug } = await params;
    console.log(slug);

    // Find category by name
    const getProduct = await ProductModel.findOne({
      slug,
      deletedAt: null,
    }).lean();

    const id = getProduct?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(false, 400, "Invalid product ID format");
    }

    let matchStage = {};
    matchStage = { deletedAt: null, _id: new mongoose.Types.ObjectId(id) };

    const getProductWithVariant = await ProductModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },
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
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      // Compute distinct fields from variants
      {
        $addFields: {
          weights: {
            $setUnion: [
              {
                $reduce: {
                  input: "$variants.weight",
                  initialValue: [],
                  in: { $setUnion: ["$$value", "$$this"] },
                },
              },
            ],
          },
          flavours: {
            $setUnion: [
              {
                $reduce: {
                  input: "$variants.flavour",
                  initialValue: [],
                  in: { $setUnion: ["$$value", "$$this"] },
                },
              },
            ],
          },
          creams: {
            $setUnion: [
              {
                $reduce: {
                  input: "$variants.cream",
                  initialValue: [],
                  in: { $setUnion: ["$$value", "$$this"] },
                },
              },
              [],
            ],
          },

          dietarys: {
            $setUnion: [
              {
                $reduce: {
                  input: "$variants.dietary",
                  initialValue: [],
                  in: { $setUnion: ["$$value", "$$this"] },
                },
              },
              [],
            ],
          },
        },
      },

      {
        $addFields: {
          variants: {
            $filter: {
              input: "$variants",
              as: "variant",
              cond: {
                $and: [{ $eq: ["$$variant.isDefaultVariant", true] }],
              },
            },
          },
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
            weight: 1,
            flavour: 1,
            cream: 1,
            dietary: 1,
            isDefaultVariant: 1,
            mrp: 1,
            sellingPrice: 1,
            discountPercentage: 1,
          },
          category: {
            name: 1,
            slug: 1,
          },
        },
      },
    ]);

    const count = await ReviewModel.countDocuments({
      product: getProductWithVariant?.id,
    });

    const productData = {
      product: getProductWithVariant,
      reviewCount: count,
      category: getProductWithVariant[0]?.category || [],
    };

    return response(true, 200, "Products with variant found", productData);
  } catch (error) {
    return catchError(error);
  }
};
