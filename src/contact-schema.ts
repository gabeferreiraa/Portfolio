import { z } from "zod";

// Shared by the client form and the server function
export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(100),
  lastName: z.string().trim().min(1, "Last name is required.").max(100),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .max(254)
    .pipe(z.email("Please enter a valid email address (e.g. name@example.com).")),
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be under 5000 characters."),
  // Honeypot: real users never see or fill this
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = Exclude<keyof ContactInput, "company">;
