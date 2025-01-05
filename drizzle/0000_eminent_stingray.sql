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
	"user_id" integer NOT NULL,
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
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"password" text,
	"display_name" text NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "verify_email_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text,
	"token_expires_at" timestamp,
	CONSTRAINT "verify_email_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_directions" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"recipe_id" integer NOT NULL,
	"order_number" integer NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_import_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"recipe_id" integer NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "recipe_import_details_recipe_id_unique" UNIQUE("recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"recipe_id" integer NOT NULL,
	"order_number" integer NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"recipe_id" integer NOT NULL,
	"tag_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	"user_id" integer,
	"title" text NOT NULL,
	"description" text,
	"prep_time" integer DEFAULT 0 NOT NULL,
	"cook_time" integer NOT NULL,
	"difficulty" text,
	"servings" text NOT NULL,
	"private" boolean DEFAULT false NOT NULL,
	"photo" text
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_recipe_imports" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_import_details_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verify_email_tokens" ADD CONSTRAINT "verify_email_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_directions" ADD CONSTRAINT "recipe_directions_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_import_details" ADD CONSTRAINT "recipe_import_details_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recipe_imports" ADD CONSTRAINT "user_recipe_imports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recipe_imports" ADD CONSTRAINT "user_recipe_imports_recipe_import_details_id_recipe_import_details_id_fk" FOREIGN KEY ("recipe_import_details_id") REFERENCES "public"."recipe_import_details"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recipes" ADD CONSTRAINT "user_recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recipes" ADD CONSTRAINT "user_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;