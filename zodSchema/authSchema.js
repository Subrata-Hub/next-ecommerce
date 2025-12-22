import z from "zod";

const today = new Date();

export const authSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" })
    // allow letters (unicode), spaces, hyphens and apostrophes
    .regex(/^[\p{L}\p{M}'\- &]+$/u, {
      message: "Name contains invalid characters",
    }),

  email: z.string().email({ message: "Please enter a valid email address." }),
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
  //   date_of_brith: z
  //     .any()
  //     .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
  //       message: "Please select a Date of Brith", // <--- Appears for null, undefined, or invalid text
  //     })
  //     .refine((date) => date < today, {
  //       message: "Date of Brith cannot be in the Feuture", // <--- Appears for valid dates in the past
  //     }),

  //   date_of_anniversary: z
  //     .any()
  //     .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
  //       message: "Please select a anniversary Date", // <--- Appears for null, undefined, or invalid text
  //     })
  //     .refine((date) => date <= today, {
  //       message: "anniversary date cannot be in the Feuture", // <--- Appears for valid dates in the past
  //     }),

  date_of_brith: z.coerce
    .date({
      required_error: "Please select a Date of Birth",
      invalid_type_error: "Invalid Date of Birth",
    })
    .max(today, { message: "Date of Birth cannot be in the future" })
    .optional(),

  date_of_anniversary: z.coerce
    .date({
      required_error: "Please select an anniversary date",
      invalid_type_error: "Invalid anniversary date",
    })
    .max(today, { message: "Anniversary date cannot be in the future" })
    .optional(),
});
