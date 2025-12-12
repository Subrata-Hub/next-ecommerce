import { connectDB } from "@/lib/databaseconnection";
import ProductModel from "@/models/ProductModel";

export const getFeaturesProducts = async () => {
  try {
    await connectDB();

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
                    $and: [{ $eq: ["$$variant.deletedAt", null] }],
                  },
                },
              },

              sortBy: { isDefaultVariant: -1 },
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

    if (!getAllProducts) {
      //   return response(false, 404, "c");
      return {
        success: false,
        status: 404,
        message: "Features Product not found",
      };
    }

    const getFeaturesProducts = JSON.parse(JSON.stringify(getAllProducts));
    return {
      success: true,
      status: 200,
      message: "Features Product found",
      data: getFeaturesProducts, // This is now a plain array
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
