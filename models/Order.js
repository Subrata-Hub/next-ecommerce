import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  addressId: {
    type: mongoose.Schema.ObjectId,
    ref: "Address",
    required: true,
  },

  cartId: {
    type: mongoose.Schema.ObjectId,
    ref: "Cart",
    required: true,
  },

  delivery_date: {
    type: Date,
    required: true,
  },
  time_slot: {
    type: String,
    required: true,
  },

  order_note: {
    type: String,
  },
});

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema, "oders");
export default OrderModel;
