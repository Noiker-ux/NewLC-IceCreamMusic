import { relations } from "drizzle-orm";
import { boolean, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
  isVerifiedAuthor: boolean("isVerifiedAuthor").default(false),
  isAdmin: boolean("isAdmin").default(false),
  isSuperUser: boolean("isSuperUser").default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  releases: many(release, { relationName: "releases" }),
  verifications: many(verification, { relationName: "verifications" }),
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

export const release = schema.table("release", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  preview: text("preview").notNull(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  upc: text("upc").notNull(),
  track: text("track").notNull(),
});

export const releaseRelations = relations(release, ({ one }) => ({
  author: one(users, {
    fields: [release.authorId],
    references: [users.id],
  }),
}));

export const version = schema.table("version", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
});

export const releaseType = schema.table("releaseType", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
});

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
});

export const verificationRelations = relations(verification, ({ one }) => ({
  user: one(users, {
    fields: [verification.userId],
    references: [users.id],
  }),
}));

export const subscribes = schema.table("subscribes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  subscribtionLevel: text("subscribeLevel").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});
