ALTER TABLE "recipe_photos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "recipe_photos" CASCADE;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "prep_time" SET NOT NULL;