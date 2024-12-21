CREATE TABLE "magic_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text,
	"token_expires_at" timestamp,
	CONSTRAINT "magic_links_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"token" text,
	"token_expires_at" timestamp,
	CONSTRAINT "reset_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"email" text NOT NULL,
	"email_verified" timestamp,
	"password" text,
	"display_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verify_email_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"token" text,
	"token_expires_at" timestamp,
	CONSTRAINT "verify_email_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"name" text NOT NULL,
	CONSTRAINT "ingredients_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"recipe_id" serial NOT NULL,
	"ingredient_id" serial NOT NULL,
	"description" text,
	"quantity" integer NOT NULL,
	"unit" text,
	CONSTRAINT "recipe_ingredients_recipe_id_unique" UNIQUE("recipe_id"),
	CONSTRAINT "recipe_ingredients_ingredient_id_unique" UNIQUE("ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"recipe_id" serial NOT NULL,
	"photo" integer NOT NULL,
	"credit" text,
	CONSTRAINT "recipe_photos_recipe_id_unique" UNIQUE("recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"recipe_id" serial NOT NULL,
	"step_number" integer NOT NULL,
	"description" text,
	CONSTRAINT "recipe_steps_recipe_id_unique" UNIQUE("recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"recipe_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	CONSTRAINT "recipe_tags_recipe_id_unique" UNIQUE("recipe_id"),
	CONSTRAINT "recipe_tags_tag_id_unique" UNIQUE("tag_id")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"created_by" serial NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"prep_time" integer DEFAULT 0,
	"cook_time" integer NOT NULL,
	"difficulty" text,
	"servings" integer NOT NULL,
	"servings_unit" text DEFAULT 'servings',
	"image" text,
	CONSTRAINT "recipes_created_by_unique" UNIQUE("created_by")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"user_id" serial NOT NULL,
	"recipe_id" serial NOT NULL,
	"rating" smallint NOT NULL,
	"review" text,
	CONSTRAINT "user_ratings_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_ratings_recipe_id_unique" UNIQUE("recipe_id")
);
--> statement-breakpoint
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verify_email_tokens" ADD CONSTRAINT "verify_email_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_photos" ADD CONSTRAINT "recipe_photos_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;