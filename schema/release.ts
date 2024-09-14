import { release } from "@/db/schema";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const releaseInsertSchema = createInsertSchema(release).omit({
  id: true,
  authorId: true,
});

export type TReleaseInsert = z.infer<typeof releaseInsertSchema>;

export const releaseFormSchema = releaseInsertSchema.transform(
  ({ startDate, releaseDate, preorderDate, ...data }) => ({
    startDate: startDate.toISOString(),
    releaseDate: releaseDate.toISOString(),
    preorderDate: preorderDate.toISOString(),
    ...data,
  })
);

export type TReleaseFormSchema = z.infer<typeof releaseFormSchema>;

export const releaseServerSchema = releaseInsertSchema
  .extend({
    startDate: z.string(),
    releaseDate: z.string(),
    preorderDate: z.string(),
  })
  .transform(({ startDate, releaseDate, preorderDate, ...data }) => ({
    startDate: new Date(startDate),
    releaseDate: new Date(releaseDate),
    preorderDate: new Date(preorderDate),
    ...data,
  }));

export type TReleaseServerSchema = z.infer<typeof releaseServerSchema>;
