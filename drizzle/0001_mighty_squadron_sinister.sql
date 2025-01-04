ALTER TABLE "user_recipes" DROP CONSTRAINT "user_recipes_user_id_recipes_id_fk";
--> statement-breakpoint
ALTER TABLE "user_recipes" ADD CONSTRAINT "user_recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;