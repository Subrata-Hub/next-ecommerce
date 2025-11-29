import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import AddressModel from "@/models/AddressModel";

export const GET = async (request) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }
    await connectDB();

    const address = await AddressModel.find({ userId: auth.userId }).lean();

    if (!address) {
      return response(false, 404, "address not found ");
    }

    return response(true, 200, "Address found successfully", address);
  } catch (error) {
    return catchError(error);
  }
};
