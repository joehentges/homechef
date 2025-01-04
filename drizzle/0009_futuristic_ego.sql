ALTER TABLE "user_recipe_imports" DROP CONSTRAINT "user_recipe_imports_recipe_import_details_id_recipes_id_fk";
--> statement-breakpoint
ALTER TABLE "user_recipe_imports" ADD CONSTRAINT "user_recipe_imports_recipe_import_details_id_recipe_import_details_id_fk" FOREIGN KEY ("recipe_import_details_id") REFERENCES "public"."recipe_import_details"("id") ON DELETE cascade ON UPDATE no action;