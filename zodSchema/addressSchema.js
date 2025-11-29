import { z } from "zod";

// import { isValidPhoneNumber } from "libphonenumber-js";

// const schema = z.object({
//   phone: z.string().refine((val) => isValidPhoneNumber(val, "IN"), {
//     message: "Invalid Indian phone number",
//   }),
// });

export const addressSchema = z.object({
  userId: z.string().min(3, "_id is required"),
  label: z.string().min(3, "label is required"),
  addressType: z.string().min(3, "addressType is required"),
  firstName: z
    .string()
    .trim()
    .min(1, { message: "FirstName is required" })
    .max(100, { message: "FirstName must be 100 characters or less" })
    // allow letters (unicode), spaces, hyphens and apostrophes
    .regex(/^[\p{L}\p{M}'\- &]+$/u, {
      message: "FirstName contains invalid characters",
    }),

  lastName: z
    .string()
    .trim()
    .min(1, { message: " LastName is required" })
    .max(100, { message: " LastName must be 100 characters or less" })
    // allow letters (unicode), spaces, hyphens and apostrophes
    .regex(/^[\p{L}\p{M}'\- &]+$/u, {
      message: " LastName contains invalid characters",
    }),

  phoneNumber: z
    .string()
    .transform((val) => {
      // 1. Remove all non-digit characters
      const digits = val.replace(/\D/g, "");

      // 2. Remove leading '91' or '0' if the length is > 10
      //    (This converts 919876543210 or 09876543210 to 9876543210)
      if (digits.length > 10) {
        if (digits.startsWith("91")) return digits.slice(2);
        if (digits.startsWith("0")) return digits.slice(1);
      }
      return digits;
    })
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message:
        "Invalid Indian mobile number. Must be 10 digits starting with 6-9.",
    }),

  autocomplete_location: z.string().optional(),
  address_line_1: z.string().min(3, "Address Line 1 is required"),
  // address_line_2: z.string().min(3, "Address Line 2 is required"),
  address_line_2: z.string().optional(),

  city: z.string().min(1, "City is required"),

  state: z.string().min(1, "State is required"),
  pincode: z.coerce
    .number({
      required_error: "Pincode is required",
    })
    .refine((val) => val.toString().length === 6, {
      // Indian Pincodes are 6 digits
      message: "Pincode must be exactly 6 digits",
    }),
  // location: {
  //   lat: z.number().min(-90).max(90),
  //   lng: z.number().min(-180).max(180),
  // },

  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),

  distance: z.coerce.number().positive("Distance must be greater than 0"),
  isDefaultAddress: z.boolean().default(false),
});
