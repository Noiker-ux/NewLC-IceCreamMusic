import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const schema = pgSchema("icecream");

export const users = schema.table("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified"),
  password: text("password").notNull(),
  avatar: text("avatar"),
  verificationToken: text("verificationToken"),
  resetPasswordToken: text("resetPasswordToken"),
});

export const news = schema.table("news", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  announcement: text("announcement").notNull(),
});

export const faq = schema.table("faq", {
  id: uuid("id").defaultRandom().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const release = schema.table("release", {
  id: uuid("id").defaultRandom().primaryKey(),
  preview: text("preview").notNull(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  upc: text("upc").notNull(),
  track: text("track").notNull(),
});

export const genre = schema.table("genre", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
});

export const version = schema.table("version", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
});

export const releaseType = schema.table("releaseType", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
});
