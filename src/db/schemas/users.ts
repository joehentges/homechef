import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .defaultNow()
    .notNull(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .defaultNow()
    .notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  password: text("password"),
  displayName: text("display_name").notNull(),
  image: text("image"),
  summary: text("summary"),
})

export type User = typeof users.$inferSelect
