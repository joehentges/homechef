import { pgTable, serial, smallint, text, timestamp } from "drizzle-orm/pg-core"

import { recipes } from "./recipes"
import { users } from "./users"

export const userRatings = pgTable("user_ratings", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" }).defaultNow(),
  dateUpdated: timestamp("date_updated", { mode: "date" }).defaultNow(),
  userId: serial("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  recipeId: serial("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" })
    .unique(),
  rating: smallint("rating").notNull(),
  review: text("review"),
})

export type UserRating = typeof userRatings.$inferSelect
