import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import AddressModel from "@/models/AddressModel";
import { addressSchema } from "@/zodSchema/addressSchema";

export const POST = async (request) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "anauthorize");
    }
    await connectDB();

    const payload = await request.json();

    let userId = auth.userId;

    const schema = addressSchema.pick({
      label: true,
      addressType: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      autocomplete_location: true,
      address_line_1: true,
      address_line_2: true,
      city: true,
      state: true,
      pincode: true,
      location: true,
      distance: true,
      isDefaultAddress: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      // ✅ FIX 2: Console log the specific error so you know WHICH field failed
      console.log("Zod Validation Errors:", validate.error.format());

      return response(false, 400, "Invalid or missing field", {
        errors: validate.error.flatten().fieldErrors,
      });
    }

    const {
      label,
      addressType,
      firstName,
      lastName,
      phoneNumber,
      autocomplete_location,
      address_line_1,
      address_line_2,
      city,
      state,
      pincode,
      location,
      distance,
      isDefaultAddress,
    } = validate.data;

    const newAddress = new AddressModel({
      userId: userId,
      label,
      addressType,
      firstName,
      lastName,
      phoneNumber,
      autocomplete_location,
      address_line_1,
      address_line_2,
      city,
      state,
      pincode,
      location,
      distance,
      isDefaultAddress,
    });

    await newAddress.save();
    return response(true, 200, "Address create successfully", newAddress);
  } catch (error) {
    return catchError(error);
  }
};
