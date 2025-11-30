import { z } from "zod";

const nameRegex = /^[A-Z][a-zA-Z]*(?:[ '-][A-Za-z][a-zA-Z]*)*$/;

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.")
    .regex(nameRegex, "Invalid name format. Start with a capital letter."),
  lastName: z.string().trim().min(1, "Last name is required.")
    .regex(nameRegex, "Invalid name format. Start with a capital letter."),

  email: z.email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
