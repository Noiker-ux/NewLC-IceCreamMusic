import { studioPhotos, studios, studioStats, studioTeam } from "db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fileSchema } from './shared.schema';
import z from 'zod';

export const studioStatSchema = createInsertSchema(studioStats).omit({
  id: true,
  studioId: true,
});

export type TStudioStat = z.infer<typeof studioStatSchema>;

export const studioPhotoSchema = createInsertSchema(studioPhotos).omit({
  id: true,
  studioId: true,

}).extend({
  url: fileSchema,
});

export type TStudioPhoto = z.infer<typeof studioPhotoSchema>;

export const studioTeamSchema = createInsertSchema(studioTeam).omit({
  id: true,
  studioId: true,
}).extend({
  photo: fileSchema
});

export type TStudioTeam = z.infer<typeof studioTeamSchema>;

export const studioSchema = createSelectSchema(studios)
  .omit({ id: true }).extend({
    stats: studioStatSchema.array().min(1),
    photos: studioPhotoSchema.array().min(1),
    team: studioTeamSchema.array().min(1),
    logo: fileSchema,
    background: fileSchema,
  })

export type TStudio = z.infer<typeof studioSchema>;


