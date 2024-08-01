import z from "zod";

export const signUpClientSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
});

export type TSignUpClientSchema = z.infer<typeof signUpClientSchema>;

export const signUpSchema = signUpClientSchema.omit({ confirmPassword: true });

export type TSignUpSchema = z.infer<typeof signUpSchema>;
