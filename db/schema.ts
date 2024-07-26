import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const schema = pgSchema("icecream");

export const users = schema.table("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified"),
  password: text("password"),
  avatar: text("avatar"),
});
