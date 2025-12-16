import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productUrl: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  flavour: {
    type: String,
    required: true,
  },
  cream: {
    type: String,
    required: true,
  },
  dietary: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    require: true,
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

  quantity: {
    type: Number,
    required: true,
    default: 1,
  },

  totalIitemPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  discountPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  itemTotal: {
    type: Number,
    required: true,
    default: 0,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cartItems: [cartItemSchema],
  subTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  totalDiscount: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  totalItem: {
    type: Number,
    required: true,
    default: 0,
  },
  distance: {
    type: Number,
    required: true,
    default: 0,
  },
  delivery_fee: {
    type: Number,
    required: true,
    default: 0,
  },
});

const CartModel =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema, "carts");
export default CartModel;
