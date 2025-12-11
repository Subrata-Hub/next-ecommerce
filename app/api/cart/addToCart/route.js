import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperFunction";
import { credentialsSchema } from "@/lib/zodSchema";
import CartModel from "@/models/CartModel";
import ProductModel from "@/models/ProductModel";
import ProductVariantModel from "@/models/ProductVariantModel";
import MediaModel from "@/models/MediaModel";
import { z } from "zod"; // Needed to extend schema

export const POST = async (request) => {
  try {
    await connectDB();

    // 1. Extend Schema for optional cartId
    const schema = credentialsSchema
      .pick({
        productId: true,
        variantId: true,
        quantity: true,
      })
      .extend({
        cartId: z.string().optional().nullable(),
        userId: z.string().optional().nullable(),
        distance: z.number().min(0, "Distance cannot be negative").optional(),
        delivery_fee: z
          .number()
          .min(0, "Delivery fee cannot be negative")
          .optional(),
      });

    const payload = await request.json();

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field");
    }

    const { data } = validate;

    // 2. Fetch Product & Variant
    const product = await ProductModel.findById(data.productId)
      .populate("media", "_id secure_url alt")
      .lean();

    if (!product) return response(false, 404, "Product not found");

    const variant = await ProductVariantModel.findOne({
      product: product._id,
      _id: data.variantId,
    }).lean();

    if (!variant) return response(false, 404, "Variant not found");

    // 3. Prepare Item Data
    const incomingQuantity = data.quantity;
    const totalIitemPrice = variant.mrp * incomingQuantity;
    const itemTotal = variant.sellingPrice * incomingQuantity;
    const discountPrice = totalIitemPrice - itemTotal;

    const newItem = {
      productId: product._id,
      variantId: variant._id,
      productName: product.name,
      productUrl: product.slug,
      media: product?.media[0]?.secure_url,
      weight: variant.weight,
      flavour: variant.flavour,
      cream: variant.cream,
      dietary: variant.dietary,
      mrp: variant.mrp,
      sellingPrice: variant.sellingPrice,
      discountPercentage: variant.discountPercentage,
      quantity: incomingQuantity,
      totalIitemPrice: totalIitemPrice,
      discountPrice: discountPrice,
      itemTotal: itemTotal,
    };

    // 4. Find Cart (if ID exists)
    let cart = null;
    if (data.cartId && typeof data.cartId === "string") {
      cart = await CartModel.findById(data.cartId);
    }

    // 5. Logic: Create New OR Update Existing
    if (!cart) {
      // --- Create New Cart ---
      cart = new CartModel({
        cartItems: [newItem],
      });
    } else {
      // --- Update Existing Cart ---
      const itemIndex = cart.cartItems.findIndex(
        (item) =>
          item.productId.toString() === data.productId &&
          item.variantId.toString() === data.variantId
      );

      if (itemIndex > -1) {
        const existingItem = cart.cartItems[itemIndex];
        existingItem.quantity += incomingQuantity;
        // // if (incomingQuantity >= 1) {

        // }

        // Recalculate item totals
        existingItem.totalIitemPrice = existingItem.mrp * existingItem.quantity;
        existingItem.itemTotal =
          existingItem.sellingPrice * existingItem.quantity;
        existingItem.discountPrice =
          existingItem.totalIitemPrice - existingItem.itemTotal;

        // Remove or Update

        if (existingItem.quantity <= 0) {
          cart.cartItems.splice(itemIndex, 1);
        } else {
          cart.cartItems[itemIndex] = existingItem;
        }
      } else {
        // Item doesn't exist in cart, push it
        if (incomingQuantity > 0) {
          cart.cartItems.push(newItem);
        }
      }
    }

    // 6. Recalculate Cart-Wide Totals (Runs for BOTH new and existing carts)
    cart.totalItem = cart.cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    cart.subTotal = cart.cartItems.reduce(
      (acc, item) => acc + item.totalIitemPrice,
      0
    );
    cart.totalDiscount = cart.cartItems.reduce(
      (acc, item) => acc + item.discountPrice,
      0
    );
    cart.total = cart.cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
    cart.userId = data.userId;
    // cart.distance = data.distance;
    // cart.delivery_fee = data.delivery_fee;

    if (data.distance !== undefined) {
      cart.distance = data.distance;
    }

    if (data.delivery_fee !== undefined) {
      cart.delivery_fee = data.delivery_fee;
    }

    // 7. Save and Return Response
    const newCartData = await cart.save();

    console.log(newCartData);

    // IMPORTANT: Return an object with cartId so frontend can find it
    return response(true, 200, "Cart updated successfully", {
      cartId: newCartData._id,
    });
  } catch (error) {
    return catchError(error);
  }
};
