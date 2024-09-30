import { release, track } from "@/db/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const trackInsertSchema = createInsertSchema(track).omit({
  id: true,
  releaseId: true,
  fileType: true,
});

export type TTrackInsert = z.infer<typeof trackInsertSchema>;

const stringAsDateSchema = z.string().refine((value) => {
  try {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
});

export const trackFormSchema = trackInsertSchema.extend({
  track: z.any().refine((file: File) => {
    return file instanceof File;
  }),
  text_sync: z
    .any()
    .refine((file: File) => {
      return file instanceof File;
    })
    .optional(),
  ringtone: z
    .any()
    .refine((file: File) => {
      return file instanceof File;
    })
    .optional(),
  video: z
    .any()
    .refine((file: File) => {
      return file instanceof File;
    })
    .optional(),
  instant_gratification: stringAsDateSchema.optional(),
  roles: z
    .object({
      person: z.string(),
      role: z.string(),
    })
    .array(),
});

export type TTrackForm = z.infer<typeof trackFormSchema>;

export const releaseInsertSchema = createInsertSchema(release).omit({
  id: true,
  authorId: true,
  status: true,
  rejectReason: true,
});

export type TReleaseInsert = z.infer<typeof releaseInsertSchema>;

export const releaseFormSchema = releaseInsertSchema.extend({
  preview: z.any().refine((file: File) => {
    return file instanceof File && file.size < 30000000;
  }),

  area: z.object({
    negate: z.boolean(),
    data: z.string().array(),
  }),

  platforms: z.string().array(),

  tracks: trackFormSchema.array(),

  releaseDate: stringAsDateSchema,

  startDate: stringAsDateSchema,

  preorderDate: stringAsDateSchema,
});

export type TReleaseForm = z.infer<typeof releaseFormSchema>;

// export const releaseClientSchema = releaseFormSchema.transform(
//   ({ startDate, releaseDate, preorderDate, ...data }) => ({
//     startDate: startDate.toISOString(),
//     releaseDate: releaseDate.toISOString(),
//     preorderDate: preorderDate.toISOString(),
//     ...data,
//   })
// );

// export const releaseServerSchema = releaseFormSchema
//   .extend({
//     startDate: z.string(),
//     releaseDate: z.string(),
//     preorderDate: z.string(),
//   })
//   .transform(({ startDate, releaseDate, preorderDate, ...data }) => ({
//     startDate: new Date(startDate),
//     releaseDate: new Date(releaseDate),
//     preorderDate: new Date(preorderDate),
//     ...data,
//   }));

// export type TReleaseServerSchema = z.infer<typeof releaseServerSchema>;

// export const selectReleaseSchema = createSelectSchema(release);

// export type TReleaseSelect = z.infer<typeof selectReleaseSchema>;
