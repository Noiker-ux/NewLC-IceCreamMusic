import z from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;
