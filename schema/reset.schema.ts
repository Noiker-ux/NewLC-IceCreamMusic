import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(1),
    confirm: z.string().min(1),
  })
  .refine((data) => data.confirm === data.password, "Пароли не совпадают");

export type TResetPassword = z.infer<typeof resetPasswordSchema>;
