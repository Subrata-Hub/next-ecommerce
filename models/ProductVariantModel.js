import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
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

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

const ProductVariantModel =
  mongoose.models.ProductVariant ||
  mongoose.model("ProductVariant", productVariantSchema, "productvariants");
export default ProductVariantModel;
