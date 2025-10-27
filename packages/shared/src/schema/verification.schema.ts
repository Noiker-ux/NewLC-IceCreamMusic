import { verification } from "db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { fileSchema, stringAsDateSchema } from './shared.schema';

export const verificationInsertSchema = createInsertSchema(verification).omit({
  id: true,
  userId: true,
  status: true,
});

export const verificationFormSchema = verificationInsertSchema.extend({
  contract: fileSchema,
}).transform(
  ({ getDate, birthDate, ...data }) => ({
    birthDate: birthDate.toISOString(),
    getDate: getDate.toISOString(),
    ...data,
  })
);

export const verificationSchema = verificationInsertSchema
  .extend({ birthDate: stringAsDateSchema, getDate: stringAsDateSchema })
  .transform(({ getDate, birthDate, ...data }) => ({
    birthDate: new Date(birthDate),
    getDate: new Date(getDate),
    ...data,
  }));

export type TVerificationFormSchema = z.infer<typeof verificationFormSchema>;
