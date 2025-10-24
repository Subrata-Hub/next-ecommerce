// import { isAuthenticated } from "@/lib/authentication";
// import { connectDB } from "@/lib/databaseconnection";
// import { catchError, response } from "@/lib/helperFunction";
// import CategoryModel from "@/models/CategoryModel";
// import ProductModel from "@/models/ProductModel";

// import { isValidObjectId } from "mongoose";

// export const GET = async (request, { params }) => {
//   try {
//     // const auth = await isAuthenticated("admin");
//     // if (!auth.isAuth) {
//     //   return response(false, 403, "Unauthorize");
//     // }

//     await connectDB();

//     const getParams = await params;
//     const name = getParams.name;

//     const filter = {
//       deletedAt: null,
//     };

//     // if (!isValidObjectId(name)) {
//     //   return response(false, 400, "Invalid Object ID");
//     // }

//     filter.name = name;

//     const getCategory = await CategoryModel.findOne(filter).lean();

//     if (!getCategory) {
//       return response(false, 401, "Category not found");
//     }

//     const categoryId = getCategory?._id;

//     const getAllProducts = await ProductModel.find({ category: categoryId });

//     const mediaUrls = [];

//     return response(
//       true,
//       200,
//       "product for perticular category found",
//       getAllProducts
//     );
//   } catch (error) {
//     return catchError(error);
//   }
// };

import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";
import ProductModel from "@/models/ProductModel";

export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { name } = await params;

    // Find category by name
    const getCategory = await CategoryModel.findOne({
      name,
      deletedAt: null,
    }).lean();

    if (!getCategory) {
      return response(false, 404, "Category not found");
    }

    const categoryId = getCategory._id;

    // Find all products that include this category (supports multiple categories)
    const getAllProducts = await ProductModel.find({
      category: { $in: [categoryId] },
      deletedAt: null,
    })
      .populate("media", "_id secure_url")
      .sort({ createdAt: -1 }) // Sort newest first
      .limit(4) // Limit to 4 products
      .lean();

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
