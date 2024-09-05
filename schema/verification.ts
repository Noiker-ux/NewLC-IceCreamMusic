import { verification } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const verificationInsertSchema = createInsertSchema(verification);

export const verificationFormSchema = verificationInsertSchema
  .omit({
    id: true,
    userId: true,
  })
  .transform(({ getDate, birthDate, ...data }) => ({
    birthDate: birthDate.toISOString(),
    getDate: getDate.toISOString(),
    ...data,
  }));

export type TVerificationFormSchema = z.infer<typeof verificationFormSchema>;
