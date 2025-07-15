import { relations } from "drizzle-orm";

import {
  boolean,
  doublePrecision,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
  smallint,
  varchar,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import {
  subscriptionLevelValues,
  verificationStatusValues,
  verificationTokenTypeValues,
} from "./types";
import { real } from "drizzle-orm/pg-core";

export const schema = pgSchema("icecream");

export const subscriptionLevels = schema.enum(
  "subscribe_level",
  subscriptionLevelValues
);

export const users = schema.table("user", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  email: text("email").unique().notNull(),

  emailVerified: timestamp("emailVerified"),

  password: text("password"),

  avatar: text("avatar"),

  verificationToken: text("verificationToken"),

  resetPasswordToken: text("resetPasswordToken"),

  isVerifiedAuthor: boolean("isVerifiedAuthor").notNull().default(false),

  isAdmin: boolean("isAdmin").notNull().default(false),

  isSubscribed: boolean("isSubscribed").notNull().default(false),

  subscriptionLevel: subscriptionLevels("subscribeLevel"),

  subscriptionExpires: timestamp("expiresAt"),

  freeReleases: doublePrecision("freeReleases").notNull().default(0),

  balance: doublePrecision("balance").notNull().default(0),

  birthDate: timestamp("birthDate"),

  country: text("country"),

  label: text("label"),

  personalSiteUrl: text("personalSiteUrl"),

  telegram: text("telegram"),

  vk: text("vk"),

  whatsapp: text("whatsup"),

  viber: text("viber"),
});

export const usersRelations = relations(users, ({ many }) => ({
  releases: many(release),

  verifications: many(verification),

  orders: many(orders),

  payment_methods: many(payment_method),

  payouts: many(payouts),

  accounts: many(accounts),

  verificationTokens: many(verificationTokens),

  sessions: many(sessions),

  analytics: many(analytics),
}));

export const accounts = schema.table(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 16 }).notNull(),

    provider: varchar("provider", { length: 256 }).notNull(),

    providerAccountId: varchar("provider_ccount_id", { length: 256 }).notNull(),

    refresh_token: varchar("refresh_token", { length: 256 }),

    access_token: varchar("access_token", { length: 256 }),

    expires_at: timestamp("expires_at", { mode: "date" }),

    token_type: varchar("token_type", { length: 256 }),

    scope: varchar("scope", { length: 256 }),

    id_token: varchar("id_token", { length: 256 }),

    session_state: varchar("session_state", { length: 256 }),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = schema.table("sessions", {
  sessionToken: varchar("session_token", { length: 128 }).primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokenTypes = schema.enum(
  "token_types",
  verificationTokenTypeValues
);

export const verificationTokens = schema.table("verification_tokens", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  token: text("token").notNull().primaryKey(),

  expires: timestamp("expires", { mode: "date" }).notNull(),

  type: verificationTokenTypes("type").notNull(),
});

export const verificationTokensRelations = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.id],
    }),
  })
);

export const news = schema.table("news", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),

  preview: text("preview"),

  content: text("content").notNull(),

  createdAt: timestamp("createdAt").defaultNow(),
});

// Придумать как хранить теги к новостям

export const faq = schema.table("faq", {
  id: uuid("id").defaultRandom().primaryKey(),

  question: text("question").notNull(),

  answer: text("answer").notNull(),
});

export const verificationStatuses = schema.enum(
  "verification_status",
  verificationStatusValues
);

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
  rejectReason: text("rejectReason"),
});

export const verificationRelations = relations(verification, ({ one }) => ({
  user: one(users, {
    fields: [verification.userId],
    references: [users.id],
  }),
}));

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

  performer: text("performer"),

  feat: text("feat"),

  remixer: text("remixer"),

  genre: text("genre").notNull(),

  upc: text("upc"),

  labelName: text("labelName"),

  releaseDate: timestamp("date").notNull(),

  startDate: timestamp("startDate").notNull(),

  preorderDate: timestamp("preorderDate").notNull(),

  platforms: jsonb("platforms"),

  area: jsonb("area"),

  confirmed: boolean("confirmed").notNull().default(false),

  status: verificationStatuses("status").notNull().default("moderating"),

  rejectReason: text("rejectReason"),

  roles: jsonb("roles"),

  moderatorComment: text("moderatorComment"),

  earlyStartInRussia: boolean("earlyStartInRussia"),

  realTimeDelivery: boolean("realTimeDelivery"),

  yandexSoonNewRelease: timestamp("yandexSoonNewRelease"),
});

export const release_relations = relations(release, ({ one, many }) => ({
  author: one(users, {
    fields: [release.authorId],
    references: [users.id],
  }),

  tracks: many(track),

  promoLinks: many(promoLinks),
}));

export const track = schema.table("track", {
  id: uuid("id").defaultRandom().primaryKey(),

  releaseId: uuid("releaseId")
    .notNull()
    .references(() => release.id, { onDelete: "cascade", onUpdate: "cascade" }),

  title: text("title").notNull(),

  subtitle: text("subtitle"),

  isrc: text("isrc"),

  author_rights: text("author_rights").notNull(),

  partner_code: text("partner_code"),

  roles: jsonb("roles"),

  preview_start: text("preview_start").notNull(),

  instant_gratification: timestamp("instant_gratification_date"),

  focus: boolean("focus").notNull().default(false),

  explicit: boolean("explicit").notNull().default(false),

  live: boolean("live").notNull().default(false),

  cover: boolean("cover").notNull().default(false),

  remix: boolean("remix").notNull().default(false),

  instrumental: boolean("instrumental").notNull().default(false),

  language: text("language").notNull(),

  text: text("text"),

  track: text("track").notNull(),

  text_sync: text("text_sync"),

  ringtone: text("ringtone"),

  video: text("video"),

  video_shot: text("video_shot"),

  index: smallint("index").notNull(),
});

export const trackRelations = relations(track, ({ one }) => ({
  release: one(release, {
    fields: [track.releaseId],
    references: [release.id],
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
  }),
}));

export const payouts = schema.table("payouts", {
  id: uuid("id").primaryKey(),

  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),

  createdAt: timestamp("createdAt").defaultNow(),

  confirmed: boolean("confirmed").default(false),

  recieverName: text("recieverName"),

  amount: doublePrecision("amount"),
});

export const payouts_relations = relations(payouts, ({ one }) => ({
  user: one(users, {
    fields: [payouts.userId],
    references: [users.id],
  }),
}));

export const studios = schema.table("studios", {
  id: uuid("id").primaryKey().defaultRandom(),

  logo: text("logo").notNull(),

  background: text("background"),

  name: text("name").notNull(),

  rating: real("rating").notNull().default(0),

  address: text("address").notNull(),

  annotation: text("annotation"),

  description: text("description"),
});

export const studios_relations = relations(studios, ({ many }) => ({
  photos: many(studioPhotos),
  team: many(studioTeam),
  stats: many(studioStats),
}));

export const studioPhotos = schema.table("studio_photos", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),

  url: text("url").notNull(),

  studioId: uuid("studioId")
    .notNull()
    .references(() => studios.id, { onUpdate: "cascade", onDelete: "cascade" }),
});

export const studio_photos_relations = relations(studioPhotos, ({ one }) => ({
  studio: one(studios, {
    fields: [studioPhotos.studioId],
    references: [studios.id],
  }),
}));

export const studioTeam = schema.table("studio_team", {
  id: uuid("id").primaryKey().defaultRandom(),

  studioId: uuid("studioId")
    .notNull()
    .references(() => studios.id, { onUpdate: "cascade", onDelete: "cascade" }),

  photo: text("photo").notNull(),

  name: text("name").notNull(),

  position: text("position").notNull(),

  place: text("place").notNull(),
});

export const studio_team_relations = relations(studioTeam, ({ one }) => ({
  studio: one(studios, {
    fields: [studioTeam.studioId],
    references: [studios.id],
  }),
}));

export const studioStats = schema.table("studio_stats", {
  id: uuid("id").primaryKey().defaultRandom(),

  studioId: uuid("studioId")
    .notNull()
    .references(() => studios.id, { onUpdate: "cascade", onDelete: "cascade" }),

  name: text("name").notNull(),

  value: text("value").notNull(),
});

export const studio_stats_relations = relations(studioStats, ({ one }) => ({
  studio: one(studios, {
    fields: [studioStats.studioId],
    references: [studios.id],
  }),
}));

export const analytics = schema.table("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  periodStart: timestamp("periodStart").notNull(),

  periodFinish: timestamp("periodFinish").notNull(),

  reportFileUrl: text("reportFileUrl"),

  flourishReportMarkup: text("flourishReportMarkup").notNull(),
});

export const analytics_relations = relations(analytics, ({ one }) => ({
  user: one(users, {
    fields: [analytics.userId],
    references: [users.id],
  }),
}));

export const promoLinks = schema.table("promo_links", {
  id: uuid("id").primaryKey().defaultRandom(),

  shortName: text("shortName").notNull(),

  releaseId: uuid("releaseId")
    .notNull()
    .references(() => release.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
});

export const promoLinksRelations = relations(promoLinks, ({ one, many }) => ({
  release: one(release, {
    fields: [promoLinks.releaseId],
    references: [release.id],
  }),
  urls: many(promoUrls),
}));

export const promoUrls = schema.table("promo_urls", {
  id: uuid("id").primaryKey().defaultRandom(),

  url: text("url").notNull(),

  promoLinkId: uuid("promoLinkId").references(() => promoLinks.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const promo_urls_relations = relations(promoUrls, ({ one }) => ({
  promoLink: one(promoLinks, {
    fields: [promoUrls.promoLinkId],
    references: [promoLinks.id],
  }),
}));
