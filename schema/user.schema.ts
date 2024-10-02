import { users } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(users);

export const selectUserSchema = createSelectSchema(users).pick({
  id: true,
  email: true,
  avatar: true,
  name: true,
});

export type TInsertUserSchema = z.infer<typeof insertUserSchema>;

export type TSelectUserSchema = z.infer<typeof selectUserSchema>;
