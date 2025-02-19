import { relations } from "drizzle-orm";
// import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  jsonb,
  json,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: text("role").$type<"user" | "admin">().default("user").notNull(),
});

export const designs = pgTable("designs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  thumbnail: text("thumbnail"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  isPublic: boolean("is_public").default(false),
  pages: jsonb("pages").default([]),
  currentPage: integer("current_page").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  thumbnail: text("thumbnail").notNull(),
  category: text("category").notNull(),
  pages: jsonb("pages").default([]),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  isPro: boolean("is_pro").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'image', 'svg', 'video', etc
  filename: text("filename").notNull(),
  key: text("key").notNull(), // R2 object key
  url: text("url").notNull(), // R2 public URL
  size: integer("size").notNull(), // file size in bytes
  mimeType: text("mime_type").notNull(),
  thumbnail: text("thumbnail"), // thumbnail URL
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define the type first
// type FoldersTable = ReturnType<typeof createFoldersTable>;

// Create a function to define the table
export function createFoldersTable() {
  return pgTable("folders", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    parentId: uuid("parent_id").references((): any => folders.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
  });
}

// Create the table
export const folders = createFoldersTable();

export const fonts = pgTable("fonts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  isSystem: boolean("is_system").default(false),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export const models = pgTable("models", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  modelId: text("model_id").notNull(),
  modelName: text("model_name").notNull(),
  gender: text("gender").notNull(),
  version: text("version").notNull(),
  trainingStatus: text("training_status").notNull(),
  triggerWord: text("trigger_word").notNull(),
  trainingTime: text("training_time").notNull(),
  trainingSteps: integer("training_steps").notNull(),
  trainingId: text("training_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storyTemplates = pgTable("story_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  category: text("category").notNull(), // kids, grown-ups
  prompt: text("prompt").notNull(),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  designId: uuid("design_id")
    .references(() => designs.id, { onDelete: "cascade" })
    .unique(), // One design can have only one story
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  coverImagePrompt: text("cover_image_prompt").notNull(),
  coverImageUrl: text("cover_image_url"),
  chapters: jsonb("chapters").default([]).notNull(), // Will store array of chapter objects
  language: text("language").notNull(),
  genre: text("genre"),
  tone: text("tone"),
  storyType: text("story_type"), // For kids stories
  imageStyle: text("image_style").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const designsRelations = relations(designs, ({ one }) => ({
  user: one(users, {
    fields: [designs.userId],
    references: [users.id],
  }),
  story: one(stories, {
    fields: [designs.id],
    references: [stories.id],
  }),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  user: one(users, {
    fields: [assets.userId],
    references: [users.id],
  }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, {
    fields: [folders.userId],
    references: [users.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
}));

export const modelsRelations = relations(models, ({ one }) => ({
  user: one(users, {
    fields: [models.userId],
    references: [users.id],
  }),
}));

export const storyTemplatesRelations = relations(
  storyTemplates,
  ({ many }) => ({
    stories: many(models),
  }),
);

export const storiesRelations = relations(stories, ({ one }) => ({
  design: one(designs, {
    fields: [stories.designId],
    references: [designs.id],
  }),
}));

export const subscriptions = pgTable("subscription", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status")
    .$type<
      | "trialing"
      | "active"
      | "canceled"
      | "incomplete"
      | "incomplete_expired"
      | "past_due"
      | "unpaid"
      | "paused"
    >()
    .notNull(),
  price_id: text("price_id").references(() => prices.id),
  customer_id: text("customer_id").notNull(),
  quantity: integer("quantity"),
  cancel_at: timestamp("cancel_at", { mode: "string" }),
  cancel_at_period_end: boolean("cancel_at_period_end"),
  canceled_at: timestamp("canceled_at", { mode: "string" }),
  current_period_start: timestamp("current_period_start", {
    mode: "string",
  }).notNull(),
  current_period_end: timestamp("current_period_end", {
    mode: "string",
  }).notNull(),
  created: timestamp("created", { mode: "string" }).notNull(),
  ended_at: timestamp("ended_at", { mode: "string" }),
  trial_start: timestamp("trial_start", { mode: "string" }),
  trial_end: timestamp("trial_end", { mode: "string" }),
  metadata: json("metadata"),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  active: boolean("active"),
  name: text("name"),
  description: text("description"),
  image: text("image"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const prices = pgTable("prices", {
  id: text("id").primaryKey(),
  active: boolean("active"),
  currency: text("currency"),
  description: text("description"),
  interval: text("interval").$type<"day" | "week" | "month" | "year">(),
  interval_count: integer("interval_count"),
  metadata: json("metadata"),
  product_id: text("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  trial_period_days: integer("trial_period_days"),
  type: text("type").$type<"one_time" | "recurring">(),
  unit_amount: integer("unit_amount"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Add relation to products
export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
}));

// Types for TypeScript
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Price = typeof prices.$inferSelect;
export type NewPrice = typeof prices.$inferInsert;

export const credits = pgTable("credits", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  image_generation_count: integer("image_generation_count").default(0),
  max_image_generation_count: integer("max_image_generation_count").default(0),
  model_training_count: integer("model_training_count").default(0),
  max_model_training_count: integer("max_model_training_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Add relation to users
export const userRelations = relations(users, ({ one }) => ({
  credits: one(credits, {
    fields: [users.id],
    references: [credits.user_id],
  }),
}));

// Types for TypeScript
export type Credit = typeof credits.$inferSelect;
export type NewCredit = typeof credits.$inferInsert;

// Type for TypeScript
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

// Type for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Add subscription relations
export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  price: one(prices, {
    fields: [subscriptions.price_id],
    references: [prices.id],
  }),
  user: one(users, {
    fields: [subscriptions.user_id],
    references: [users.id],
  }),
}));
