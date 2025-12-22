import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    isDefaultVariant: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      required: true,
    },

    cream: {
      type: String,
      required: true,
    },

    flavour: {
      type: String,
      required: true,
    },

    dietary: {
      type: String,
      required: true,
    },

    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const mediaSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const favouriteItemSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    mrp: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },

    media: [mediaSchema],
    variants: [productVariantSchema],
    weights: { type: [Number], required: true },
    creams: { type: [String], required: true },
    flavours: { type: [String], required: true },
    dietarys: { type: [String], required: true },
  },
  { _id: false }
);

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publicUserId: {
      type: String,
      required: true,
    },
    products: [favouriteItemSchema],

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

const FavouriteModel =
  mongoose.models.Favourite ||
  mongoose.model("Favourite", favouriteSchema, "favourites");
export default FavouriteModel;
