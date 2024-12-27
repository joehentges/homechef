ALTER TABLE "recipe_photos" ADD COLUMN "defaultPhoto" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "image";