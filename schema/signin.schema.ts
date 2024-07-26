import z from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean(),
});

export type TSignInSchema = z.infer<typeof signInSchema>;
