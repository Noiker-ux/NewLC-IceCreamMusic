import { verification } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const verificationSchema = createInsertSchema(verification).omit({
  id: true,
  userId: true,
});

export type TVerificationSchema = z.infer<typeof verificationSchema>;
