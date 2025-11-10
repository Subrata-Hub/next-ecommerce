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
    const mrp = searchParams.get("mrp") || 0;

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
                  { $eq: ["$$variant.deletedAt", null] },
                  { $eq: ["$$variant.isDefaultVariant", true] },
                  { $gte: ["$$variant.mrp", parseFloat(mrp - 300)] },
                  { $lte: ["$$variant.mrp", parseFloat(mrp + 500)] },

                  // --- CORRECTED LOGIC ---
                  // We check if the param exists AND is not an empty string

                  weight && weight.length > 0 // Check for non-empty string
                    ? {
                        $anyElementTrue: {
                          $map: {
                            input: weight.split(","),
                            as: "w",
                            in: {
                              $in: [{ $toInt: "$$w" }, "$$variant.weight"],
                            },
                          },
                        },
                      }
                    : { $literal: true }, // <-- FIX: Use true to ignore filter

                  flavour && flavour.length > 0
                    ? {
                        $anyElementTrue: {
                          $map: {
                            input: flavour.split(","),
                            as: "f",
                            in: { $in: ["$$f", "$$variant.flavour"] },
                          },
                        },
                      }
                    : { $literal: true }, // <-- FIX: Use true to ignore filter

                  cream && cream.length > 0
                    ? {
                        $anyElementTrue: {
                          $map: {
                            input: cream.split(","),
                            as: "c",
                            in: { $in: ["$$c", "$$variant.cream"] },
                          },
                        },
                      }
                    : { $literal: true }, // <-- FIX: Use true to ignore filter

                  dietary && dietary.length > 0
                    ? {
                        $anyElementTrue: {
                          $map: {
                            input: dietary.split(","),
                            as: "d",
                            in: { $in: ["$$d", "$$variant.dietary"] },
                          },
                        },
                      }
                    : { $literal: true }, // <-- FIX: Use true to ignore filter
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
