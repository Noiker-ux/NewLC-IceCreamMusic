import { studioPhotos, studios, studioStats, studioTeam } from "db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fileSchema } from "./shared.schema";
import { z } from "zod";
import { InferSelectModel } from 'drizzle-orm';
import { TrueOmit } from '../types/omit';

const StudioStatBaseSchema = createInsertSchema(studioStats).omit({
  studioId: true,
});

export type TStudioStatInsert = z.infer<typeof StudioStatBaseSchema>;

export const studioStatInsertFormSchema = StudioStatBaseSchema.omit({
  id: true,
});

export type TStudioStatInsertForm = z.infer<typeof studioStatInsertFormSchema>;

export const studioStatUpdateFormSchema = studioStatInsertFormSchema
  .partial();

export type TStudioStatUpdateForm = z.infer<typeof studioStatUpdateFormSchema>;

const StudioPhotoBaseSchema = createInsertSchema(studioPhotos).omit({
  studioId: true,
});

export type TStudioPhotoInsert = z.infer<typeof StudioPhotoBaseSchema>;

const studioPhotoInsertSchema = StudioPhotoBaseSchema.omit({
  id: true,
});

export const studioPhotoInsertFormSchema = studioPhotoInsertSchema.extend({
  url: fileSchema,
});

export type TStudioPhotoInsertForm = z.infer<typeof studioPhotoInsertFormSchema>;

export const studioPhotoUpdateSchema = StudioPhotoBaseSchema
  .partial();

export type TStudioPhotoUpdateForm = z.infer<typeof studioPhotoUpdateSchema>;

const StudioTeamBaseSchema = createInsertSchema(studioTeam).omit({
  studioId: true,
});

export type TStudioTeamInsert = z.infer<typeof StudioTeamBaseSchema>;

const studioTeamIdSchema = createSelectSchema(studioTeam).shape.id;

const studioTeamInsertSchema = StudioTeamBaseSchema.omit({
  id: true,
});

export const studioTeamInsertFormSchema = studioTeamInsertSchema.extend({
  photo: fileSchema,
});

export type TStudioTeamInsertForm = z.infer<typeof studioTeamInsertFormSchema>;

export const studioTeamUpdateSchema = studioTeamInsertFormSchema
  .partial()
  .extend({
    teamId: studioTeamIdSchema.optional(),
  });

export type TStudioTeamUpdateForm = z.infer<typeof studioTeamUpdateSchema>;

const StudioBaseSchema = createInsertSchema(studios);

export type TStudioInsert = TrueOmit<z.infer<typeof StudioBaseSchema>, 'id'>;

const StudioFormBaseSchema = StudioBaseSchema.omit({ id: true }).extend({
  logo: fileSchema,
  background: fileSchema,
});

export const studioInsertFormSchema = StudioFormBaseSchema.extend({
  photos: studioPhotoInsertFormSchema.array().min(1),
  team: studioTeamInsertFormSchema.array().min(1),
  stats: studioStatInsertFormSchema.array().min(1),
});

export type TStudioInsertForm = z.infer<typeof studioInsertFormSchema>;

export const studioUpdateSchema = StudioFormBaseSchema.partial().extend({
  photos: studioPhotoInsertFormSchema.array().min(1).optional(),
  team: studioTeamInsertFormSchema.array().min(1).optional(),
  stats: studioStatInsertFormSchema.array().min(1).optional(),
});

export type TStudioUpdateForm = z.infer<typeof studioUpdateSchema>;

export function createStudioUpsertSchema(isUpdating: boolean){
  const statSchema = isUpdating ? studioStatUpdateFormSchema : studioStatInsertFormSchema;

  const photoSchema = isUpdating ? studioPhotoUpdateSchema : studioPhotoInsertFormSchema;

  const teamSchema = isUpdating ? studioTeamUpdateSchema : studioTeamInsertFormSchema;

  if(isUpdating){
    return StudioFormBaseSchema.partial().extend({
      stats: statSchema.array().min(1).optional(),
      photos: photoSchema.array().min(1).optional(),
      team: teamSchema.array().min(1).optional(),
    })
  }

  return StudioFormBaseSchema.extend({
    stats: statSchema.array().min(1),
    photos: photoSchema.array().min(1),
    team: teamSchema.array().min(1),
  })
}

export type TStudioUpsertForm = z.infer<ReturnType<typeof createStudioUpsertSchema>>;

export type TStudio = InferSelectModel<typeof studios>;

export type TStudioStat = InferSelectModel<typeof studioStats>;

export type TStudioPhoto = InferSelectModel<typeof studioPhotos>;

export type TStudioTeam = InferSelectModel<typeof studioTeam>;

export type TStudioData = TStudio & {
  photos: TStudioPhoto[],
  team: TStudioTeam[],
  stats: TStudioStat[],
}

export type TStudioInsertData = TStudioInsert & {
  photos: z.infer<typeof studioPhotoInsertSchema>[];
  team: z.infer<typeof studioTeamInsertSchema>[];
  stats: z.infer<typeof studioStatInsertFormSchema>[];
}

export type TStudioUpdateData = Partial<TStudioInsert> & {
  photos: z.infer<typeof studioPhotoUpdateSchema>;
  team: z.infer<typeof studioTeamUpdateSchema>;
  stats: z.infer<typeof studioStatUpdateFormSchema>;
};