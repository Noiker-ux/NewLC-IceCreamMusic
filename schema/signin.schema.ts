import z from "zod";

export const signInClientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean(),
});

export const signInSchema = signInClientSchema.omit({ rememberMe: true });

export type TSignInClientSchema = z.infer<typeof signInClientSchema>;

export type TSignInSchema = z.infer<typeof signInSchema>;
