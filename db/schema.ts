import { relations } from "drizzle-orm";

import {
  boolean,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const schema = pgSchema("icecream");

export const subscriptionLevels = schema.enum("subscribe_level", [
  "standard",
  "professional",
  "premium",
]);

export const users = schema.table("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified"),
  password: text("password").notNull(),
  avatar: text("avatar"),
  verificationToken: text("verificationToken"),
  resetPasswordToken: text("resetPasswordToken"),
  isVerifiedAuthor: boolean("isVerifiedAuthor").notNull().default(false),
  isAdmin: boolean("isAdmin").notNull().default(false),
  isSuperUser: boolean("isSuperUser").notNull().default(false),
  isSubscribed: boolean("isSubscribed").notNull().default(false),
  subscriptionLevel: subscriptionLevels("subscribeLevel"),
  subscriptionExpires: timestamp("expiresAt"),
});

export const usersRelations = relations(users, ({ many }) => ({
  releases: many(release, { relationName: "releases" }),
  verifications: many(verification, { relationName: "verifications" }),
  orders: many(orders, { relationName: "orders" }),
  payment_methods: many(payment_method, { relationName: "payment_methods" }),
}));

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

export const releaseTypes = schema.enum("release_type", [
  "single",
  "album",
  "ep",
]);

export const release = schema.table("release", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),

  preview: text("preview").notNull(),
  language: text("language").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  type: releaseTypes("type").notNull(),

  performer: text("performer").notNull(),
  feat: text("feat"),
  remixer: text("remixer"),

  genre: text("genre").notNull(),

  upc: text("upc"),

  labelName: text("labelName").notNull(),

  releaseDate: timestamp("date").notNull(),
  startDate: timestamp("startDate").notNull(),
  preorderDate: timestamp("preorderDate").notNull(),

  platforms: jsonb("platforms"),

  area: jsonb("area"),

  track: text("track").notNull(),

  confirmed: boolean("confirmed").notNull().default(false),
});

export const releaseRelations = relations(release, ({ one }) => ({
  author: one(users, {
    fields: [release.authorId],
    references: [users.id],
  }),
}));

export const verificationStatuses = schema.enum("verification_status", [
  "moderating",
  "approved",
  "rejected",
]);

export const verification = schema.table("verification", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  firstName: text("firstName").notNull(),
  middleName: text("middleName").notNull(),
  lastName: text("lastName").notNull(),
  birthDate: timestamp("birthDate").notNull(),
  birthPlace: text("birthPlace").notNull(),
  tel: text("tel").notNull(),
  passSeries: text("passSeries").notNull(),
  passNumber: text("passNum").notNull(),
  getDate: timestamp("getDate").notNull(),
  givenBy: text("givenBy").notNull(),
  subunitCode: text("subunitCode").notNull(),
  registrationAddress: text("registrationAddress").notNull(),
  accountNumber: text("accountNumber").notNull(),
  bankName: text("bankName").notNull(),
  status: verificationStatuses("status").notNull().default("moderating"),
});

export const verificationRelations = relations(verification, ({ one }) => ({
  user: one(users, {
    fields: [verification.userId],
    references: [users.id],
  }),
}));

export const orderTypes = schema.enum("order_type", [
  "subscription",
  "release",
]);

export const orders = schema.table("orders", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  type: orderTypes("type").notNull(),
  metadata: jsonb("metadata").notNull(),
  confirmed: boolean("confirmed").notNull().default(false),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const payment_method = schema.table("payment_methods", {
  id: uuid("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  metadata: jsonb("metadata").notNull(),
  isDefault: boolean("isDefault").notNull().default(false),
});

export const payment_methodRelations = relations(payment_method, ({ one }) => ({
  user: one(users, {
    fields: [payment_method.userId],
    references: [users.id],
    relationName: "user",
  }),
}));
