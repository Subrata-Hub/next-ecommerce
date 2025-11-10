import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";

import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }
    await connectDB();
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    // Build match query
    let matchQuery = {};
    if (deleteType === "SD") {
      matchQuery = { deletedAt: null };
    } else if (deleteType === "PD") {
      matchQuery = { deletedAt: { $ne: null } };
    }

    // Global search
    if (globalFilter) {
      matchQuery["$or"] = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
        { "categoryData.name": { $regex: globalFilter, $options: "i" } }, // This now works
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
      ];
    }

    // Column filteration
    filters.forEach((filter) => {
      if (
        filter.id === "mrp" ||
        filter.id === "sellingPrice" ||
        filter.id === "discountPercentage"
      ) {
        matchQuery[filter.id] = Number(filter.value);
      } else {
        matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    });

    // Sorting
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // =================================================================
    // ✅ NEW: Define common stages for both data and count pipelines
    // =================================================================
    const commonStages = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        // I've uncommented your $unwind, it's cleaner
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: matchQuery },
    ];

    // =================================================================
    // ✅ NEW: Pipeline to get the actual data (with pagination)
    // =================================================================
    const dataPipeline = [
      ...commonStages,
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          // Now "category" will be a string, not an array
          category: "$categoryData.name",
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // =================================================================
    // ✅ NEW: Pipeline to get the total count (matching the filter)
    // =================================================================
    const countPipeline = [
      ...commonStages,
      {
        $count: "totalRowCount",
      },
    ];

    // =================================================================
    // ✅ NEW: Execute both queries in parallel
    // =================================================================
    const [getProduct, countResult] = await Promise.all([
      ProductModel.aggregate(dataPipeline),
      ProductModel.aggregate(countPipeline),
    ]);

    // Get totalCount from the count aggregation result
    const totalRowCount = countResult[0]?.totalRowCount || 0;

    return NextResponse.json({
      success: true,
      data: getProduct,
      meta: { totalRowCount }, // Send the correct count
    });
  } catch (error) {
    return catchError(error);
  }
};
