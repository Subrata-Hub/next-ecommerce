import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";
import MediaModel from "@/models/MediaModel";

export const GET = async (request) => {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;

    // get filters from query params
    const weight = searchParams.get("weight");
    const flavour = searchParams.get("flavour");
    const cream = searchParams.get("cream");
    const dietary = searchParams.get("dietary");
    const sellingPrice = searchParams.get("sellingPrice") || 0;

    const matchStage = { deletedAt: null };

    const getAllProducts = await ProductModel.aggregate([
      { $match: matchStage },
      // { $sort: { createdAt: -1 } },

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
        $addFields: {
          variants: {
            $filter: {
              input: "$variants",
              as: "variant",
              cond: {
                $and: [
                  { $eq: ["$$variant.deletedAt", null] },
                  // { $eq: ["$$variant.isDefaultVariant", true] },
                  {
                    $gte: [
                      "$$variant.sellingPrice",
                      parseFloat(sellingPrice - 300),
                    ],
                  },
                  {
                    $lte: [
                      "$$variant.sellingPrice",
                      parseFloat(sellingPrice + 500),
                    ],
                  },

                  weight
                    ? {
                        $in: [
                          { $toString: "$$variant.weight" },
                          weight.split(","),
                        ],
                      }
                    : { $literal: true },

                  flavour
                    ? {
                        $in: ["$$variant.flavour", flavour.split(",")],
                      }
                    : { $literal: true },

                  // cream
                  //   ? {
                  //       $in: ["$$variant.cream", cream.split(",")],
                  //     }
                  //   : { $literal: true },

                  // dietary
                  //   ? {
                  //       $in: ["$$variant.dietry", dietary.split(",")],
                  //     }
                  //   : { $literal: true },
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

      { $limit: 8 },

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
    ]);

    if (!getAllProducts) {
      return response(false, 404, "products not found");
    }
    return response(true, 200, "product found", getAllProducts);
  } catch (error) {
    return catchError(error);
  }
};
