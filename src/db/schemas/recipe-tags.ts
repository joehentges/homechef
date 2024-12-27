import { pgTable, serial, timestamp } from "drizzle-orm/pg-core"

import { recipes } from "./recipes"
import { tags } from "./tags"

export const recipeTags = pgTable("recipe_tags", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  recipeId: serial("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  tagId: serial("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
})

export type RecipeTag = typeof recipeTags.$inferSelect
