import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/CategoryModel";

export const POST = async (request) => {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }

    await connectDB();

    const payload = await request.json();

    const schema = credentialsSchema.pick({
      name: true,
      slug: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const { name, slug } = validate.data;

    const newCategory = new CategoryModel({ name, slug });

    await newCategory.save();

    return response(true, 200, "category create successfully");
  } catch (error) {
    return catchError(error);
  }
};
