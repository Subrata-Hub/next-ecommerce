import { z } from "zod";

// This is the main validation schema for a user's credentials.
// It can be used for both sign-up and login forms to ensure
// the data is in a valid format before sending it to the server.

export const credentialsSchema = z.object({
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
    .regex(/^[\p{L}\p{M}'\- ]+$/u, {
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
});
