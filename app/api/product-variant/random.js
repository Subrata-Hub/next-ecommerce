import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";
import mongoose from "mongoose";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;

    // --- 1. Get Filters ---
    const weight = searchParams.get("weight");
    const flavour = searchParams.get("flavour");
    const cream = searchParams.get("cream");
    const dietary = searchParams.get("dietary");
    const minPrice = searchParams.get("minPrice") || 0;
    const maxPrice = searchParams.get("maxPrice") || 1000000;
    const search = searchParams.get("q");

    // --- 2. Pagination ---
    const limit = parseInt(searchParams.get("limit") || 9);
    const page = parseInt(searchParams.get("page")) || 0;
    const skip = page * limit;

    // --- 3. Initial Sorting (Product-level only) ---
    let sortQuery = {};
    const sortOption = searchParams.get("sort") || "default_sorting";
    if (sortOption === "default_sorting") sortQuery = { createdAt: -1 };
    if (sortOption === "asc") sortQuery = { name: 1 };
    if (sortOption === "desc") sortQuery = { name: -1 };

    // --- 4. Initial Match Stage ---
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

    // --- 5. Define the Core Filter Pipeline ---
    const filterPipeline = [{ $match: matchStage }];

    // --- Conditionally add initial sort ---
    // Only add the sort stage if it's not empty (i.e., not a price sort)
    if (Object.keys(sortQuery).length > 0) {
      filterPipeline.push({ $sort: sortQuery });
    }

    filterPipeline.push(
      { $match: matchStage },
      { $sort: sortQuery }, // <-- Use the initial non-price sort
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },
      // (Optional) Compute distinct fields for filters
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

      // Filter and Sort the variants array (This is the fix from before)
      {
        $addFields: {
          variants: {
            $sortArray: {
              input: {
                $filter: {
                  input: "$variants",
                  as: "variant",
                  cond: {
                    $and: [
                      // All your filter conditions
                      weight
                        ? {
                            $anyElementTrue: {
                              $map: {
                                input: weight.split(","),
                                as: "w",
                                // Use $toInt because URL params are strings
                                in: {
                                  $in: [{ $toInt: "$$w" }, "$$variant.weight"],
                                },
                              },
                            },
                          }
                        : { $literal: true },
                      // Check if any filter flavour is present...
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
                      // Check if any filter cream is present...
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
                      // Check if any filter dietary is present...
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
                      {
                        $gte: ["$$variant.sellingPrice", parseFloat(minPrice)],
                      },
                      {
                        $lte: ["$$variant.sellingPrice", parseFloat(maxPrice)],
                      },
                      { $eq: ["$$variant.deletedAt", null] },
                    ],
                  },
                },
              },
              sortBy: { isDefaultVariant: -1 }, // Sorts 'true' variants first
            },
          },
        },
      },
      // Remove products that have no matching variants
      {
        $match: {
          variants: { $ne: [] },
        },
      }
    );

    // --- 6. NEW: Add Price Sorting Stages (if needed) ---
    if (sortOption === "price_low_high" || sortOption === "price_high_low") {
      // Add a field 'sortPrice' based on the *first* variant (which is the default)
      filterPipeline.push({
        $addFields: {
          sortPrice: { $arrayElemAt: ["$variants.sellingPrice", 0] },
        },
      });

      // Now add the new sort stage
      filterPipeline.push({
        $sort: { sortPrice: sortOption === "price_low_high" ? 1 : -1 },
      });
    }

    // --- 7. Run Queries in Parallel (Correct Count + Paging) ---

    // A. Get the CORRECT total count
    const countPromise = ProductModel.aggregate([
      ...filterPipeline,
      { $count: "total" },
    ]);

    // B. Get the paginated products
    const productsPromise = ProductModel.aggregate([
      ...filterPipeline,
      { $skip: skip },
      { $limit: limit + 1 }, // Fetch one extra
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
          // Your project fields
          _id: 1,
          name: 1,
          slug: 1,
          media: 1,
          weights: 1,
          flavours: 1,
          creams: 1,
          dietarys: 1,
          variants: 1,
          // 'sortPrice' is automatically removed by $project
        },
      },
    ]);

    // --- 8. Wait for Both and Send Response ---
    const [countResult, products] = await Promise.all([
      countPromise,
      productsPromise,
    ]);

    const totalProducts = countResult[0]?.total || 0;

    let nextPage = null;
    if (products.length > limit) {
      nextPage = page + 1;
      products.pop(); // Remove the extra one
    }

    return response(true, 200, "Products for this category found", {
      products,
      nextPage,
      totalProducts, // This is the correct, filtered total
    });
  } catch (error) {
    return catchError(error);
  }
};

import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";
// We don't need to import ProductVariantModel here
// because the aggregation pipeline refers to it by its collection name "productvariants"

export const GET = async (request) => {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;

    // Get filters from query params
    const weight = searchParams.get("weight");
    const flavour = searchParams.get("flavour");
    const cream = searchParams.get("cream");
    const dietary = searchParams.get("dietary");
    const sellingPrice = searchParams.get("sellingPrice") || 0;

    console.log("Filters received:", { weight, flavour, cream, dietary });

    // --- This is the aggregation pipeline ---
    const pipeline = [];

    // 1. Start with products that are not deleted
    pipeline.push({ $match: { deletedAt: null } });

    // 2. Look up media
    pipeline.push({
      $lookup: {
        from: "medias",
        localField: "media",
        foreignField: "_id",
        as: "media",
      },
    });

    // 3. Look up variants
    pipeline.push({
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product",
        as: "variants",
      },
    });

    // 4. Create fields for all available options (for frontend filters)
    pipeline.push({
      $addFields: {
        weights: { $setUnion: "$variants.weight" },
        flavours: { $setUnion: "$variants.flavour" },
        creams: { $setUnion: "$variants.cream" },
        dietarys: { $setUnion: "$variants.dietary" },
      },
    });

    // --- 5. Dynamically build filter conditions for variants ---
    const variantFilterConditions = [{ $eq: ["$$variant.deletedAt", null] }];

    // Add filters ONLY if they are present in the query URL
    if (weight) {
      variantFilterConditions.push({
        $in: ["$$variant.weight", weight.split(",").map(Number)], // Convert weight to number
      });
    }
    if (flavour) {
      variantFilterConditions.push({
        $in: ["$$variant.flavour", flavour.split(",")],
      });
    }
    if (cream) {
      variantFilterConditions.push({
        $in: ["$$variant.cream", cream.split(",")],
      });
    }
    if (dietary) {
      variantFilterConditions.push({
        $in: ["$$variant.dietary", dietary.split(",")],
      });
    }

    // 6. Filter the nested 'variants' array
    pipeline.push({
      $addFields: {
        variants: {
          $filter: {
            input: "$variants",
            as: "variant",
            cond: { $and: variantFilterConditions },
          },
        },
      },
    });

    // 7. Remove products that have no matching variants left
    pipeline.push({
      $match: {
        variants: { $ne: [] }, // or $gt: { $size: 0 }
      },
    });

    // 8. Set a limit
    pipeline.push({ $limit: 8 });

    // 9. Project the final shape (this is from your request)
    pipeline.push({
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
    });

    // --- Execute the pipeline ---
    const getSimilarProducts = await ProductModel.aggregate(pipeline);

    if (!getSimilarProducts || getSimilarProducts.length === 0) {
      return response(false, 404, "products not found");
    }

    // This returns an array of PRODUCTS, each with a filtered 'variants' array
    return response(true, 200, "products found", getSimilarProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return catchError(error);
  }
};
