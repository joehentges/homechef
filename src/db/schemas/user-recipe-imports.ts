import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core"

import { recipeImportDetails } from "./recipe-import-details"
import { users } from "./users"

// The instances a user has imported a recipe
export const userRecipeImports = pgTable("user_recipe_imports", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  recipeImportDetailsId: integer("recipe_import_details_id")
    .references(() => recipeImportDetails.id, { onDelete: "cascade" })
    .notNull(),
})

export type UserRecipeImport = typeof userRecipeImports.$inferSelect
