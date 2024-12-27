import { pgTable, serial, smallint, text, timestamp } from "drizzle-orm/pg-core"

import { recipes } from "./recipes"
import { users } from "./users"

export const recipeUserRatings = pgTable("recipe_user_ratings", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  userId: serial("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recipeId: serial("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  review: text("review"),
})

export type RecipeUserRating = typeof recipeUserRatings.$inferSelect
