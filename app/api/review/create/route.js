import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";

import ReviewModel from "@/models/ReviewModel";

export const POST = async (request) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }

    await connectDB();

    const payload = await request.json();

    const schema = credentialsSchema.pick({
      product: true,
      userId: true,
      rating: true,
      title: true,
      review: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const { product, userId, rating, title, review } = validate.data;

    const newReview = new ReviewModel({
      product,
      user: userId,
      rating,
      title,
      review,
    });

    await newReview.save();

    return response(true, 200, "Your review submited  successfully");
  } catch (error) {
    return catchError(error);
  }
};
