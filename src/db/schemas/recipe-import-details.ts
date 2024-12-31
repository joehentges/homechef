import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const recipeImportDetails = pgTable("recipe_import_details", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  url: text("url").notNull(),
})

export type RecipeImportDetails = typeof recipeImportDetails.$inferSelect
