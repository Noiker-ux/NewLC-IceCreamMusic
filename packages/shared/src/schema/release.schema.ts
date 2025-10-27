import { release, track } from "db/schema";
import { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { fileSchema, stringAsDateSchema } from "./shared.schema";

export const authorRightsSchema = z.coerce
  .number()
  .min(1)
  .max(
    100,
    "Значение должно быть числом больше или равно 1 и меньше либо равно 100"
  );

export type TAuthorRights = z.infer<typeof authorRightsSchema>;

const roleSchema = z.object({
  person: z.string(),
  role: z.string(),
});

const validateRequiredRoles =
  (requiredRoles: string[]) => (value: z.infer<typeof roleSchema>[]) => {
    const roles = new Set(value.map((v) => v.role));
    return requiredRoles.every((role) => roles.has(role));
  };

export const trackRolesSchema = roleSchema
  .array()
  .refine(
    validateRequiredRoles(["Исполнитель", "Автор слов", "Автор музыки"]),
    "Для трека требуются Исполнитель, Автор слов и Автор музыки"
  );

export type TTrackRoles = z.infer<typeof trackRolesSchema>;

export const releaseRolesSchema = roleSchema
  .array()
  .refine(
    validateRequiredRoles(["Исполнитель"]),
    "Для релиза требуется Исполнитель"
  );

export type TReleaseRoles = z.infer<typeof releaseRolesSchema>;

export const optionalFileSchema = fileSchema.optional();

export const releasePreviewSchema = fileSchema.refine((file) => {
  return file.size < 30000000;
});

export const releaseAreaSchema = z.object({
  negate: z.boolean(),
  data: z.string().array(),
});

export type TReleaseArea = z.infer<typeof releaseAreaSchema>;

export const releasePlatformsSchema = z.string().array();

export type TReleasePlatforms = z.infer<typeof releasePlatformsSchema>;

const trackBaseSchema = createInsertSchema(track);

const TrackBaseSchema = trackBaseSchema
  .extend({
    title: z.string().min(1, "Название трека обязательно"),
    language: z.string().min(1, "Язык трека обязателен"),
    author_rights: authorRightsSchema, // Используем оптимизированную схему
    roles: trackRolesSchema,
    track: fileSchema, // Обязательный файл трека
    text_sync: optionalFileSchema,
    ringtone: optionalFileSchema,
    video: optionalFileSchema,
    video_shot: optionalFileSchema,
    instant_gratification: stringAsDateSchema,
  })
  .omit({
    id: true,
    releaseId: true,
  });

export const trackInsertSchema = TrackBaseSchema.omit({
  index: true,
});

export type TTrackInsertForm = z.infer<typeof trackInsertSchema>;

export const trackUpdateFormSchema = TrackBaseSchema.partial().extend({
  trackId: trackBaseSchema.shape.id,
});

export type TTrackUpdateForm = z.infer<typeof trackUpdateFormSchema>;

const releaseBaseSchema = createInsertSchema(release);

const ReleaseFormBaseSchema = releaseBaseSchema
  .extend({
    title: z.string().min(1, "Название релиза обязательно"),
    preview: releasePreviewSchema,
    area: releaseAreaSchema,
    platforms: releasePlatformsSchema,
    roles: releaseRolesSchema,
    startDate: stringAsDateSchema,
    preorderDate: stringAsDateSchema,
    releaseDate: stringAsDateSchema,
    yandexSoonNewRelease: stringAsDateSchema,
  })
  .omit({
    id: true,
    authorId: true,
    status: true,
    rejectReason: true,
    confirmed: true,
  });

export const releaseFormSchema = ReleaseFormBaseSchema;

export type TReleaseForm = z.infer<typeof releaseFormSchema>;

export const releaseInsertSchema = ReleaseFormBaseSchema.extend({
  tracks: trackInsertSchema.array().min(1, "Должен быть хотя бы один трек"),
});

export type TReleaseInsert = z.infer<typeof releaseInsertSchema>;

export const releaseUpdateSchema = ReleaseFormBaseSchema.extend({
  tracks: trackUpdateFormSchema.array().min(1, "Должен быть хотя бы один трек"),
}).partial();

export type TReleaseUpdate = z.infer<typeof releaseUpdateSchema>;

export type TRelease = InferSelectModel<typeof release>;

export type TTrack = InferSelectModel<typeof track>;

export function createReleaseUpsertSchema<T extends boolean>(isUpdate: T) {
  const trackSchema = isUpdate ? trackUpdateFormSchema : trackInsertSchema;
  if (isUpdate) {
    return ReleaseFormBaseSchema.partial().extend({
      tracks: trackSchema.array().min(1, "Должен быть хотя бы один трек"),
    });
  }

  return ReleaseFormBaseSchema.extend({
    tracks: trackSchema.array().min(1, "Должен быть хотя бы один трек"),
  });
}

export type TReleaseUpsert = z.infer<
  ReturnType<typeof createReleaseUpsertSchema>
>;

type qwe = TReleaseUpsert;
