import { news } from 'db/schema'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { fileSchema } from './shared.schema'

export const updateNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
})

export type TUpdateNews= z.infer<typeof updateNewsSchema>

export const updateNewsFormSchema = updateNewsSchema.extend({
  preview: fileSchema,
})

export type TUpdateNewsForm = z.infer<typeof updateNewsFormSchema>