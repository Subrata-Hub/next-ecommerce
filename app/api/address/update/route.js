import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import AddressModel from "@/models/AddressModel";
import { addressSchema } from "@/zodSchema/addressSchema";
import mongoose from "mongoose";
import z, { safeParse } from "zod";

export const PUT = async (request) => {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorize");
    }

    await connectDB();

    // We cast to String() here to ensure we are checking the HEX string, not an object
    if (!mongoose.Types.ObjectId.isValid(String(auth.userId))) {
      return response(false, 400, "Invalid User ID");
    }

    // silencing the "deprecated" warning and handling both String/Object inputs safely.
    const userId = new mongoose.Types.ObjectId(String(auth.userId));

    const schema = addressSchema
      .pick({
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
      })
      .extend({
        addressId: z.string().min("3", "address field is required"),
      });

    const payload = await request.json();

    const validate = schema.safeParse(payload);

    const updatedAddress = validate.data;

    const addressId = updatedAddress.addressId;

    if (!addressId) {
      return response(false, 400, "Invalid AddressId");
    }

    const address = await AddressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return response(false, 404, "Address not found");
    }

    address.label = updatedAddress.label;
    address.addressType = updatedAddress.addressType;
    address.firstName = updatedAddress.firstName;
    address.lastName = updatedAddress.lastName;
    address.phoneNumber = updatedAddress.phoneNumber;
    address.autocomplete_location = updatedAddress.autocomplete_location;
    address.address_line_1 = updatedAddress.address_line_1;
    address.address_line_2 = updatedAddress.address_line_2;
    address.city = updatedAddress.city;
    address.state = updatedAddress.state;
    address.pincode = updatedAddress.pincode;
    address.location = updatedAddress.location;
    address.distance = updatedAddress.distance;
    address.isDefaultAddress = updatedAddress.isDefaultAddress;

    await address.save();

    return response(true, 200, "Address updated successfully");
  } catch (error) {
    return catchError(error);
  }
};
