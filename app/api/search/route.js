import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";

export const GET = async (request) => {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get("q");

    let matchQuery = {};
    matchQuery = { deletedAt: null };

    matchQuery["$or"] = [
      { name: { $regex: query, $options: "i" } },
      { slug: { $regex: query, $options: "i" } },
      { "categoryData.name": { $regex: query, $options: "i" } },
    ];

    const aggregatePipeline = [
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
            $sortArray: {
              input: {
                $filter: {
                  input: "$variants",
                  as: "variant",
                  cond: {
                    $and: [
                      // { $eq: ["$$variant.isDefaultVariant", true] },
                      { $eq: ["$$variant.deletedAt", null] },
                    ],
                  },
                },
              },
              sortBy: { isDefaultVariant: -1 },
            },
          },
        },
      },

      { $limit: 10 },
      {
        $match: {
          variants: { $ne: [] },
        },
      },
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
    ];

    const productSuggesstion = await ProductModel.aggregate(aggregatePipeline);

    if (!productSuggesstion) {
      return response(false, 404, "products not found");
    }

    return response(true, 200, "product found", productSuggesstion);
  } catch (error) {
    return catchError(error);
  }
};
