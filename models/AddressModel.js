import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    addressType: {
      type: String,
      required: true,
      enum: {
        values: ["residential", "office", "others"],
        message: `{VALUE} is incorrect addressType`,
      },
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },

    autocomplete_location: {
      type: String,
    },

    address_line_1: {
      type: String,
      required: true,
    },

    address_line_2: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    distance: {
      type: Number,
      required: true,
    },
    isDefaultAddress: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AddressModel =
  mongoose.models.Address ||
  mongoose.model("Address", addressSchema, "addresses");
export default AddressModel;
