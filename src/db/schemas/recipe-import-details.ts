import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { recipes } from "./recipes"
import { users } from "./users"

export const recipeImportDetails = pgTable("recipe_import_details", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  importedBy: integer("imported_by").references(() => users.id),
  recipeId: integer("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  url: text("url").notNull(),
})

export type RecipeImportDetails = typeof recipeImportDetails.$inferSelect
