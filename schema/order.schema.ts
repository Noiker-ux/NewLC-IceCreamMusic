import { z } from "zod";
import { selectUserSchema } from "./user.schema";

export const releaseMetadataSchema = z.object({
  releaseId: z.string(),
});

export type TReleaseMetadata = z.infer<typeof releaseMetadataSchema>;

export const subscriptionMetadataSchema = selectUserSchema.pick({
  subscriptionLevel: true,
});

export type TSubscriptionMetadata = z.infer<typeof subscriptionMetadataSchema>;
