import { z } from "zod";
import { selectUserSchema } from "./user.schema";

export const releaseMetadataSchema = z.object({
  releaseId: z.string(),
});

export const subscriptionMetadataSchema = selectUserSchema.pick({
  subscriptionLevel: true,
});
