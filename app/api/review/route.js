import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/ReviewModel";

import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }
    await connectDB();
    const searchParams = request.nextUrl.searchParams;

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
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        { "userData.name": { $regex: globalFilter, $options: "i" } },
        // { rating: { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$rating" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column filteration
    filters.forEach((filter) => {
      if (filter.id === "product") {
        matchQuery[productData.name] = { $regex: filter.value, $options: "i" };
      } else if (filter.id === "user") {
        matchQuery[userData.name] = { $regex: filter.value, $options: "i" };
      }
      matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
    });

    // Sorting
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // Aggreate pipeline
    const aggregatePipeline = [
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "ProductData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "UserData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          product: "$productData.name",
          user: "userData.name",
          rating: 1,
          review: 1,
          title: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Execute query
    const getReview = await ReviewModel.aggregate(aggregatePipeline);

    // Get totalCount
    const totalRowCount = await ReviewModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getReview,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
};
