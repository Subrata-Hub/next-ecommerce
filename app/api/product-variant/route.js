import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";

import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    // Extract query parameter

    // const start = parseInt(searchParams.get("start") || 0, 10);
    // const size = parseInt(searchParams.get("size") || 10, 10);
    // const filters = JSON.parse(searchParams.get("filters") || "[]");
    // const globalFilter = searchParams.get("globalFilter" || "");
    // const sorting = searchParams.get("sorting" || "[]");
    // const deleteType = searchParams.get("deleteType");

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
        { cream: { $elemMatch: { $regex: globalFilter, $options: "i" } } },
        { flavour: { $elemMatch: { $regex: globalFilter, $options: "i" } } },
        { dietary: { $elemMatch: { $regex: globalFilter, $options: "i" } } },
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$isDefaultVariant" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $anyElementTrue: {
              $map: {
                input: "$weight",
                as: "w",
                in: {
                  $regexMatch: {
                    input: { $toString: "$$w" },
                    regex: globalFilter,
                    options: "i",
                  },
                },
              },
            },
          },
        },
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
      } else if (filter.id === "product") {
        matchQuery["productData.name"] = {
          $regex: filter.value,
          $options: "i",
        };
      } else if (filter.id === "isDefaultVariant") {
        matchQuery[filter.id] = filter.value === "true";
      } else {
        matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
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
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
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
          isDefaultVariant: 1,
          weight: 1,
          cream: 1,
          flavour: 1,
          dietary: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Execute query
    const getProductVariant = await ProductVariantModel.aggregate(
      aggregatePipeline
    );

    // Get totalCount
    const totalRowCount = await ProductVariantModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getProductVariant,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
};
