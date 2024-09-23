import { release } from "@/db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const releaseInsertSchema = createInsertSchema(release).omit({
  id: true,
  authorId: true,
});

export type TReleaseInsert = z.infer<typeof releaseInsertSchema>;

export const releaseFormSchema = releaseInsertSchema.extend({
  preview: z.any().refine((file: File) => {
    return file instanceof File && file.size < 30000000;
  }),
  track: z.any().refine((file: File) => {
    return file instanceof File && file.type;
  }),
  area: z.object({
    negate: z.boolean(),
    data: z.string().array(),
  }),
  platforms: z.string().array(),
});

export type TReleaseFormSchema = z.infer<typeof releaseFormSchema>;

export const releaseClientSchema = releaseFormSchema.transform(
  ({ startDate, releaseDate, preorderDate, ...data }) => ({
    startDate: startDate.toISOString(),
    releaseDate: releaseDate.toISOString(),
    preorderDate: preorderDate.toISOString(),
    ...data,
  })
);

export const releaseServerSchema = releaseFormSchema
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

export const selectReleaseSchema = createSelectSchema(release);

export type TReleaseSelect = z.infer<typeof selectReleaseSchema>;
