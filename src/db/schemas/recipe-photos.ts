import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { recipes } from "./recipes"

export const recipePhotos = pgTable("recipe_photos", {
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
  photoUrl: text("photo").notNull(),
  defaultPhoto: boolean().default(false).notNull(),
})

export type RecipePhoto = typeof recipePhotos.$inferSelect
