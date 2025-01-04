CREATE TABLE "user_recipe_imports" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_import_details_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recipe_import_details" DROP CONSTRAINT "recipe_import_details_imported_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_recipe_imports" ADD CONSTRAINT "user_recipe_imports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recipe_imports" ADD CONSTRAINT "user_recipe_imports_recipe_import_details_id_recipes_id_fk" FOREIGN KEY ("recipe_import_details_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_import_details" DROP COLUMN "imported_by";