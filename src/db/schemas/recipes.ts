import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { users } from "./users"

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  description: text("description"),
  prepTime: integer("prep_time").default(0),
  cookTime: integer("cook_time").notNull(),
  difficulty: text("difficulty", {
    enum: ["beginner", "intermediate", "advanced"],
  }),
  servings: text("servings").notNull(),
  private: boolean("private").default(false).notNull(),
})

export type Recipe = typeof recipes.$inferSelect
