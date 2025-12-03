import z from "zod";

const yesterday = new Date();
yesterday.setHours(0, 0, 0, 0);
yesterday.setDate(yesterday.getDate() - 1);

export const orderSchema = z.object({
  addressId: z.string().min(3, "addressId is required"),
  cartId: z.string().min(3, "cartId is required"),

  delivery_date: z
    .any()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Please select a delivery date", // <--- Appears for null, undefined, or invalid text
    })
    .refine((date) => date >= yesterday, {
      message: "Delivery date cannot be in the past", // <--- Appears for valid dates in the past
    }),
  time_slot: z.string().min(1, "Time slot is required"),
  order_note: z.string().optional(),
});
