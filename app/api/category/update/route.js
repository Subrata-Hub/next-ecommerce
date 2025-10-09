import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/CategoryModel";

export const PUT = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }

    await connectDB();

    const payload = await request.json();

    const schema = credentialsSchema.pick({
      _id: true,
      name: true,
      slug: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const { _id, name, slug } = validate.data;

    const getCategory = await CategoryModel.findOne({ deletedAt: null, _id });
    if (!getCategory) {
      return response(false, 404, "Data not found");
    }

    getCategory.name = name;
    getCategory.slug = slug;

    await getCategory.save();

    return response(true, 200, "category updated successfully");
  } catch (error) {
    return catchError(error);
  }
};
