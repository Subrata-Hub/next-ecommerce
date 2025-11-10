import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/ReviewModel";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    await connectDB();
    const productId = searchParams.get("productId");

    if (!productId) {
      return response(false, 404, "product is missing");
    }

    const reviews = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          deletedAt: null,
        },
      },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // total review

    const totalReview = reviews.reduce((sum, r) => sum + r.count, 0);
    // Average rating
    const averageRating =
      totalReview > 0
        ? (
            reviews.reduce((sum, r) => sum + r._id * r.count, 0) / totalReview
          ).toFixed(1)
        : "0.0";

    const rating = reviews.reduce((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, {});

    const percentage = reviews.reduce((acc, r) => {
      acc[r._id] = (r.count / totalReview) * 100;

      return acc;
    }, {});

    return response(true, 200, "product review", {
      totalReview,
      averageRating,
      rating,
      percentage,
    });
  } catch (error) {
    return catchError(error);
  }
}
