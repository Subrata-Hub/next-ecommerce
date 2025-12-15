// import { connectDB } from "@/lib/databaseconnection";
// import { catchError, response } from "@/lib/helperFunction";
// import CategoryModel from "@/models/CategoryModel";
// import ProductModel from "@/models/ProductModel";

// export const getProductsByCategorySlug = async (slug) => {
//   try {
//     await connectDB();

//     // const { slug } = await params;

//     // Find category by name
//     const getCategory = await CategoryModel.findOne({
//       slug,
//       deletedAt: null,
//     }).lean();

//     if (!getCategory) {
//       return response(false, 404, "Category not found");
//     }

//     const categoryId = getCategory._id;

//     let matchStage = {};

//     matchStage.category = categoryId;

//     const getAllProducts = await ProductModel.aggregate([
//       { $match: matchStage },
//       { $sort: { createdAt: -1 } },

//       {
//         $lookup: {
//           from: "medias",
//           localField: "media",
//           foreignField: "_id",
//           as: "media",
//         },
//       },
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
//           weights: { $setUnion: "$variants.weight" },
//           flavours: { $setUnion: "$variants.flavour" },
//           creams: { $setUnion: "$variants.cream" },
//           dietarys: { $setUnion: "$variants.dietary" },
//         },
//       },

//       {
//         $addFields: {
//           variants: {
//             $sortArray: {
//               input: {
//                 $filter: {
//                   input: "$variants",
//                   as: "variant",
//                   cond: {
//                     $and: [
//                       // { $eq: ["$$variant.isDefaultVariant", true] },
//                       { $eq: ["$$variant.deletedAt", null] },
//                     ],
//                   },
//                 },
//               },
//               sortBy: { isDefaultVariant: -1 },
//             },
//           },
//         },
//       },

//       {
//         $match: {
//           variants: { $ne: [] },
//         },
//       },

//       { $limit: 4 },

//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           slug: 1,
//           description: 1,
//           mrp: 1,
//           sellingPrice: 1,
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
//           // variants: 1,
//           variants: {
//             _id: 1,
//             weight: 1,
//             flavour: 1,
//             cream: 1,
//             dietary: 1,
//             isDefaultVariant: 1,
//             mrp: 1,
//             sellingPrice: 1,
//             discountPercentage: 1,
//           },
//         },
//       },
//     ]);

//     return response(
//       true,
//       200,
//       "Products for this category found",
//       getAllProducts
//     );
//   } catch (error) {
//     return catchError(error);
//   }
// };

import { connectDB } from "@/lib/databaseconnection";
import { catchError } from "@/lib/helperFunction"; // Don't import 'response'
import CategoryModel from "@/models/CategoryModel";
import ProductModel from "@/models/ProductModel";

export const getProductsByCategorySlug = async (slug) => {
  try {
    await connectDB();

    const getCategory = await CategoryModel.findOne({
      slug,
      deletedAt: null,
    }).lean();

    if (!getCategory) {
      // ❌ Don't return response(...)
      // ✅ Return a plain object
      return { success: false, status: 404, message: "Category not found" };
    }

    const categoryId = getCategory._id;
    let matchStage = { category: categoryId };

    const getAllProducts = await ProductModel.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      // ... your lookups ...
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
      // ... your addFields and unwinding ...
      {
        $addFields: {
          weights: { $setUnion: "$variants.weight" },
          flavours: { $setUnion: "$variants.flavour" },
          creams: { $setUnion: "$variants.cream" },
          dietarys: { $setUnion: "$variants.dietary" },
        },
      },
      { $match: { variants: { $ne: [] } } },
      { $limit: 4 },
      {
        $project: {
          _id: 1, // We will convert this to string manually below
          name: 1,
          slug: 1,
          description: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          media: { _id: 1, secure_url: 1, alt: 1 },
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

    // ✅ CRITICAL FIX: Convert ObjectIds to Strings and return PLAIN OBJECT
    // Next.js cannot pass MongoDB ObjectIds to Client Components.
    const cleanProducts = JSON.parse(JSON.stringify(getAllProducts));

    return {
      success: true,
      status: 200,
      message: "Products found",
      data: cleanProducts, // This is now a plain array
    };
  } catch (error) {
    console.error("DB Error:", error);
    return { success: false, message: error.message };
  }
};
