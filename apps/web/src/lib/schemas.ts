import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const serviceSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  duration: z.coerce.number().min(15, "Duration must be at least 15 minutes."),
  categoryId: z.string().min(1, "Category is required."),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
