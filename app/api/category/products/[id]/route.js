// import { connectDB } from "@/lib/databaseconnection";
// import { catchError, response } from "@/lib/helperFunction";

// import ProductModel from "@/models/ProductModel";
// import mongoose from "mongoose";

// export const GET = async (request, { params }) => {
//   try {
//     await connectDB();

//     const { id } = await params;

//     const searchParams = request.nextUrl.searchParams;

//     // get filters from query params
//     const weight = searchParams.get("weight");
//     const flavour = searchParams.get("flavour");
//     const cream = searchParams.get("cream");
//     const dietary = searchParams.get("dietary");
//     const minPrice = searchParams.get("minPrice") || 0;
//     const maxPrice = searchParams.get("maxPrice") || 1000000;
//     const search = searchParams.get("q");

//     console.log(weight);

//     // Pagination
//     const limit = parseInt(searchParams.get("limit") || 9);
//     const page = parseInt(searchParams.get("page")) || 0;
//     const skip = page * limit;

//     // sorting
//     let sortQuery = {};
//     const sortOption = searchParams.get("sort") || "default_sorting";
//     if (sortOption === "default_sorting") sortQuery = { createdAt: -1 };
//     if (sortOption === "asc") sortQuery = { name: 1 };
//     if (sortOption === "desc") sortQuery = { name: -1 };
//     // if (sortOption === "price_low_high") sortQuery = { sellingPrice: 1 };
//     // if (sortOption === "price_high_low") sortQuery = { sellingPrice: -1 };

//     //Match stage
//     let matchStage = {};

//     if (id) {
//       const ids = id
//         .split(",")
//         .filter((i) => mongoose.Types.ObjectId.isValid(i))
//         .map((i) => mongoose.Types.ObjectId.createFromHexString(i));

//       if (ids.length > 0) {
//         matchStage.category = { $in: ids };
//       }
//     }

//     if (search) {
//       matchStage.name = { $regex: search, $options: "i" };
//     }

//     // ... inside your GET function ...
//     // aggreation pipenine
//     const products = await ProductModel.aggregate([
//       { $match: matchStage },
//       { $sort: sortQuery },

//       {
//         $lookup: {
//           from: "productvariants",
//           localField: "_id",
//           foreignField: "product",
//           as: "variants",
//         },
//       },
//       // Compute distinct fields from variants
//       {
//         $addFields: {
//           weights: {
//             $setUnion: [
//               {
//                 $reduce: {
//                   input: "$variants.weight",
//                   initialValue: [],
//                   in: { $setUnion: ["$$value", "$$this"] },
//                 },
//               },
//             ],
//           },
//           flavours: {
//             $setUnion: [
//               {
//                 $reduce: {
//                   input: "$variants.flavour",
//                   initialValue: [],
//                   in: { $setUnion: ["$$value", "$$this"] },
//                 },
//               },
//             ],
//           },
//           creams: {
//             $setUnion: [
//               {
//                 $reduce: {
//                   input: "$variants.cream",
//                   initialValue: [],
//                   in: { $setUnion: ["$$value", "$$this"] },
//                 },
//               },
//               [],
//             ],
//           },

//           dietarys: {
//             $setUnion: [
//               {
//                 $reduce: {
//                   input: "$variants.dietary",
//                   initialValue: [],
//                   in: { $setUnion: ["$$value", "$$this"] },
//                 },
//               },
//               [],
//             ],
//           },
//         },
//       },

//       {
//         $addFields: {
//           variants: {
//             // 1. Use $sortArray here to wrap everything
//             $sortArray: {
//               // 2. The 'input' for the sort is the result of your $filter
//               input: {
//                 $filter: {
//                   input: "$variants",
//                   as: "variant",
//                   cond: {
//                     $and: [
//                       // Check if any filter weight is present in the variant's weight array
//                       weight
//                         ? {
//                             $anyElementTrue: {
//                               $map: {
//                                 input: weight.split(","),
//                                 as: "w",
//                                 // Use $toInt because URL params are strings
//                                 in: {
//                                   $in: [{ $toInt: "$$w" }, "$$variant.weight"],
//                                 },
//                               },
//                             },
//                           }
//                         : { $literal: true },
//                       // Check if any filter flavour is present...
//                       flavour
//                         ? {
//                             $anyElementTrue: {
//                               $map: {
//                                 input: flavour.split(","),
//                                 as: "f",
//                                 in: { $in: ["$$f", "$$variant.flavour"] },
//                               },
//                             },
//                           }
//                         : { $literal: true },
//                       // Check if any filter cream is present...
//                       cream
//                         ? {
//                             $anyElementTrue: {
//                               $map: {
//                                 input: cream.split(","),
//                                 as: "c",
//                                 in: { $in: ["$$c", "$$variant.cream"] },
//                               },
//                             },
//                           }
//                         : { $literal: true },
//                       // Check if any filter dietary is present...
//                       dietary
//                         ? {
//                             $anyElementTrue: {
//                               $map: {
//                                 input: dietary.split(","),
//                                 as: "d",
//                                 in: { $in: ["$$d", "$$variant.dietary"] },
//                               },
//                             },
//                           }
//                         : { $literal: true },

//                       {
//                         $gte: ["$$variant.sellingPrice", parseFloat(minPrice)],
//                       },
//                       {
//                         $lte: ["$$variant.sellingPrice", parseFloat(maxPrice)],
//                       },
//                       { $eq: ["$$variant.deletedAt", null] },
//                     ],
//                   },
//                 },
//               },
//               // 3. 'sortBy' goes *inside* $sortArray
//               sortBy: { isDefaultVariant: -1 }, // -1 sorts true before false
//             },
//           },
//           // 4. The 'sortBy' field you had here is REMOVED
//         },
//       },
//       // RETAIN the filter from the previous answer to ensure only products with matching variants are returned
//       {
//         $match: {
//           variants: { $ne: [] },
//         },
//       },

//       { $skip: skip },
//       { $limit: limit + 1 },

//       {
//         $lookup: {
//           from: "medias",
//           localField: "media",
//           foreignField: "_id",
//           as: "media",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           slug: 1,
//           mrp: 1,
//           sellingPrice: 1,
//           description: 1,
//           discountPercentage: 1,
//           media: {
//             _id: 1,
//             secure_url: 1,
//             alt: 1,
//           },
//           weights: 1,
//           flavours: 1,
//           creams: 1,
//           dietarys: 1,
//           variants: 1,
//           // variants: {
//           //   _id: 1,
//           //   weight: 1,
//           //   flavour: 1,
//           //   cream: 1,
//           //   dietary: 1,
//           //   isDefaultVariant: 1,
//           //   mrp: 1,
//           //   sellingPrice: 1,
//           //   discountPercentage: 1,
//           // },
//         },
//       },
//     ]);

//     // check if more data exicts

//     const productLength = await ProductModel.countDocuments({
//       category: { $in: id },
//     });

//     const totalProducts = productLength;

//     console.log(totalProducts);
//     let nextPage = null;
//     if (products.length > limit) {
//       nextPage = page + 1;
//       products.pop();
//     }

//     return response(true, 200, "Products for this category found", {
//       products,
//       nextPage,
//       totalProducts,
//     });
//   } catch (error) {
//     return catchError(error);
//   }
// };

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
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },
      // (Optional) Compute distinct fields for filters
      // {
      //   $addFields: {
      //     weights: {
      //       $setUnion: [
      //         {
      //           $reduce: {
      //             input: "$variants.weight",
      //             initialValue: [],
      //             in: { $setUnion: ["$$value", "$$this"] },
      //           },
      //         },
      //       ],
      //     },
      //     flavours: {
      //       $setUnion: [
      //         {
      //           $reduce: {
      //             input: "$variants.flavour",
      //             initialValue: [],
      //             in: { $setUnion: ["$$value", "$$this"] },
      //           },
      //         },
      //       ],
      //     },
      //     creams: {
      //       $setUnion: [
      //         {
      //           $reduce: {
      //             input: "$variants.cream",
      //             initialValue: [],
      //             in: { $setUnion: ["$$value", "$$this"] },
      //           },
      //         },
      //         [],
      //       ],
      //     },

      //     dietarys: {
      //       $setUnion: [
      //         {
      //           $reduce: {
      //             input: "$variants.dietary",
      //             initialValue: [],
      //             in: { $setUnion: ["$$value", "$$this"] },
      //           },
      //         },
      //         [],
      //       ],
      //     },
      //   },
      // },

      {
        $addFields: {
          weights: { $setUnion: "$variants.weight" },
          flavours: { $setUnion: "$variants.flavour" },
          creams: { $setUnion: "$variants.cream" },
          dietarys: { $setUnion: "$variants.dietary" },
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
                            // $anyElementTrue: {
                            //   $map: {
                            //     input: weight.split(","),
                            //     as: "w",
                            //     // Use $toInt because URL params are strings
                            //     in: {
                            //       $in: [{ $toInt: "$$w" }, "$$variant.weight"],
                            //     },
                            //   },
                            // },

                            // Check if the variant's weight (as a string)
                            // is IN the array of filter weights (e.g., ["500", "1000"])
                            $in: [
                              { $toString: "$$variant.weight" },
                              weight.split(","),
                            ],
                          }
                        : { $literal: true },
                      // Check if any filter flavour is present...
                      flavour
                        ? {
                            // $anyElementTrue: {
                            //   $map: {
                            //     input: flavour.split(","),
                            //     as: "f",
                            //     in: { $in: ["$$f", "$$variant.flavour"] },
                            //   },
                            // },
                            $in: ["$$variant.flavour", flavour.split(",")],
                          }
                        : { $literal: true },
                      // Check if any filter cream is present...
                      cream
                        ? {
                            $in: ["$$variant.cream", cream.split(",")],
                          }
                        : { $literal: true },
                      // Check if any filter dietary is present...
                      dietary
                        ? {
                            $in: ["$$variant.dietary", dietary.split(",")],
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
