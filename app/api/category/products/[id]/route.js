import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";

import ProductModel from "@/models/ProductModel";
import mongoose from "mongoose";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { id } = await params;

    const searchParams = request.nextUrl.searchParams;

    // get filters from query params
    const weight = searchParams.get("weight");
    const flavour = searchParams.get("flavour");
    const cream = searchParams.get("cream");
    const dietary = searchParams.get("dietary");
    const minPrice = searchParams.get("minPrice") || 0;
    const maxPrice = searchParams.get("maxPrice") || 1000000;
    const search = searchParams.get("q");

    console.log(weight);

    // Pagination
    const limit = parseInt(searchParams.get("limit") || 9);
    const page = parseInt(searchParams.get("page")) || 0;
    const skip = page * limit;

    // sorting
    let sortQuery = {};
    const sortOption = searchParams.get("sort") || "default_sorting";
    if (sortOption === "default_sorting") sortQuery = { createdAt: -1 };
    if (sortOption === "asc") sortQuery = { name: 1 };
    if (sortOption === "desc") sortQuery = { name: -1 };
    if (sortOption === "price_low_high") sortQuery = { sellingPrice: 1 };
    if (sortOption === "price_high_low") sortQuery = { sellingPrice: -1 };

    //Match stage
    let matchStage = {};

    if (id) {
      const ids = id
        .split(",")
        .filter((i) => mongoose.Types.ObjectId.isValid(i))
        .map((i) => mongoose.Types.ObjectId.createFromHexString(i));

      if (ids.length > 0) {
        matchStage.category = { $in: ids };
      }
    }

    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    // ... inside your GET function ...
    // aggreation pipenine
    const products = await ProductModel.aggregate([
      { $match: matchStage },
      { $sort: sortQuery },

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
                  // Check if any filter weight is present in the variant's weight array
                  weight
                    ? {
                        $anyElementTrue: {
                          $map: {
                            input: weight.split(","),
                            as: "w",
                            // Use $toInt because URL params are strings, but variant field is array of Numbers
                            in: {
                              $in: [{ $toInt: "$$w" }, "$$variant.weight"],
                            },
                          },
                        },
                      }
                    : { $literal: true },
                  // Check if any filter flavour is present in the variant's flavour array
                  flavour
                    ? {
                        $anyElementTrue: {
                          $map: {
                            input: flavour.split(","),
                            as: "f",
                            in: { $in: ["$$f", "$$variant.flavour"] },
                          },
                        },
                      }
                    : { $literal: true },
                  // Check if any filter cream is present in the variant's cream array
                  cream
                    ? {
                        $anyElementTrue: {
                          $map: {
                            input: cream.split(","),
                            as: "c",
                            in: { $in: ["$$c", "$$variant.cream"] },
                          },
                        },
                      }
                    : { $literal: true },
                  // Check if any filter dietary is present in the variant's dietary array
                  dietary
                    ? {
                        $anyElementTrue: {
                          $map: {
                            input: dietary.split(","),
                            as: "d",
                            in: { $in: ["$$d", "$$variant.dietary"] },
                          },
                        },
                      }
                    : { $literal: true },

                  { $gte: ["$$variant.sellingPrice", parseFloat(minPrice)] },
                  { $lte: ["$$variant.sellingPrice", parseFloat(maxPrice)] },
                  { $eq: ["$$variant.isDefaultVariant", true] },
                  { $eq: ["$$variant.deletedAt", null] },
                ],
              },
            },
          },
        },
      },
      // RETAIN the filter from the previous answer to ensure only products with matching variants are returned
      {
        $match: {
          variants: { $ne: [] },
        },
      },

      { $skip: skip },
      { $limit: limit + 1 },

      {
        $lookup: {
          from: "medias",
          localField: "media",
          foreignField: "_id",
          as: "media",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          description: 1,
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

    // check if more data exicts

    const productLength = await ProductModel.countDocuments({
      category: { $in: id },
    });

    const totalProducts = productLength;

    console.log(totalProducts);
    let nextPage = null;
    if (products.length > limit) {
      nextPage = page + 1;
      products.pop();
    }

    return response(true, 200, "Products for this category found", {
      products,
      nextPage,
      totalProducts,
    });
  } catch (error) {
    return catchError(error);
  }
};
