import { z } from "zod";

// This is the main validation schema for a user's credentials.
// It can be used for both sign-up and login forms to ensure
// the data is in a valid format before sending it to the server.

export const credentialsSchema = z
  .object({
    // Email validation:
    // - Must be a string.
    // - Must be a valid email format (e.g., user@example.com).
    // - Custom error message for invalid email format.
    email: z.string().email({ message: "Please enter a valid email address." }),

    // Password validation:
    // - Must be a string.
    // - Must be at least 8 characters long.
    // - Must be no more than 100 characters long.
    // - Must contain at least one uppercase letter.
    // - Must contain at least one lowercase letter.
    // - Must contain at least one number.
    // - Must contain at least one special character.
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name must be 100 characters or less" })
      // allow letters (unicode), spaces, hyphens and apostrophes
      .regex(/^[\p{L}\p{M}'\- &]+$/u, {
        message: "Name contains invalid characters",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password cannot be longer than 100 characters." })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),

    _id: z.string().min(3, "_id is required"),
    alt: z.string().min(3, "alt is required"),
    title: z.string().min(3, "title is required"),
    slug: z.string().min(3, "slug is required"),
    // category: z.string().min(3, "category is required"),
    category: z.array(z.string()).nonempty("Category is required"),
    subcategory: z.string().min(3, ""),
    isDefaultVariant: z.boolean(),

    mrp: z.union([
      z.number().positive("MRP must be positive"),
      z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, "MRP must be positive"),
    ]),
    sellingPrice: z.union([
      z.number().positive("Selling price must be positive"),
      z
        .string()
        .transform((val) => Number(val))
        .refine(
          (val) => !isNaN(val) && val > 0,
          "Selling price must be positive"
        ),
    ]),
    discountPercentage: z
      .union([
        z
          .number()
          .refine(
            (val) => val >= 0,
            "expected positive value, received negative"
          ),
        z
          .string()
          .transform((val) => Number(val))
          .refine(
            (val) => !isNaN(val) && val >= 0,
            "expected positive value, received negative"
          ),
      ])
      .default(0),
    description: z.string().min(3, "Description is required"),
    media: z.array(z.string()),
    product: z.string().min(3, "Product is required"),
    productId: z.string().min(3, "ProductId is required"),
    variantId: z.string().min(3, "variantId is required"),
    cartId: z.string().optional().nullable(),
    // quantity: z.number().positive("Quantity must be a positive number"),
    quantity: z.number().int(),
    // .nonnegative("Quantity cannot be 0 for API update"),
    // weight: z.array(z.union([z.string().min(1), z.number()])),
    // weight: z
    //   .array(z.union([z.string().min(1), z.number()]))
    //   .nonempty("Weight is required"),
    // cream: z.array(z.string()).nonempty("Cream is required"),
    // flavour: z.array(z.string()).nonempty("Flavour is required"),
    // dietary: z.array(z.string()).nonempty("Dietary is required"),

    weight: z.union([
      z.string().min(1, "Weight is required"),
      z.number().positive("Weight must be a positive number"),
    ]),
    cream: z.string().min(1, "Cream is required"),
    flavour: z.string().min(1, "Flavour is required"),
    dietary: z.string().min(1, "Dietary is required"),

    code: z.string().min(3, "Code is required"),
    minShoppingAmount: z.union([
      z.number().positive("expected positive value,recived nagative"),
      z
        .string()
        .transform((val) => Number(val))
        .refine(
          (val) => !isNaN(val) && val >= 0,
          "Please enter a valid number"
        ),
    ]),

    validity: z.coerce.date(),
    userId: z.string().min(3, "usaerId is required"),
    rating: z.union([
      z.number().positive("expected positive value,recived nagative"),
      z
        .string()
        .transform((val) => Number(val))
        .refine(
          (val) => !isNaN(val) && val >= 0,
          "Please enter a valid number"
        ),
    ]),
    review: z.string().min(3, "review is required"),
  })
  .refine(
    (data) => {
      // Allow 0 only if mrp === sellingPrice
      if (data.discountPercentage === 0 && data.mrp === data.sellingPrice) {
        return true;
      }

      // Discount must be positive otherwise
      return data.discountPercentage > 0;
    },
    {
      message: "expected positive value, received negative",
      path: ["discountPercentage"],
    }
  );
