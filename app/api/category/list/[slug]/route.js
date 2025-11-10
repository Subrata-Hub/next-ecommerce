import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";
import ProductModel from "@/models/ProductModel";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { slug } = await params;

    // Find category by name
    const getCategory = await CategoryModel.findOne({
      slug,
      deletedAt: null,
    }).lean();

    console.log(getCategory);

    if (!getCategory) {
      return response(false, 404, "Category not found");
    }

    const categoryId = getCategory._id;

    let matchStage = {};

    matchStage.category = categoryId;

    const getAllProducts = await ProductModel.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },

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
                $and: [
                  { $eq: ["$$variant.isDefaultVariant", true] },
                  { $eq: ["$$variant.deletedAt", null] },
                ],
              },
            },
          },
        },
      },

      {
        $match: {
          variants: { $ne: [] },
        },
      },

      { $limit: 4 },

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
        },
      },
    ]);

    return response(
      true,
      200,
      "Products for this category found",
      getAllProducts
    );
  } catch (error) {
    return catchError(error);
  }
};
