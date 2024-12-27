ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_recipe_id_unique";--> statement-breakpoint
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_ingredient_id_unique";--> statement-breakpoint
ALTER TABLE "recipe_photos" DROP CONSTRAINT "recipe_photos_recipe_id_unique";--> statement-breakpoint
ALTER TABLE "recipe_steps" DROP CONSTRAINT "recipe_steps_recipe_id_unique";--> statement-breakpoint
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_recipe_id_unique";--> statement-breakpoint
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_tag_id_unique";--> statement-breakpoint
ALTER TABLE "recipe_user_ratings" DROP CONSTRAINT "recipe_user_ratings_user_id_unique";--> statement-breakpoint
ALTER TABLE "recipe_user_ratings" DROP CONSTRAINT "recipe_user_ratings_recipe_id_unique";