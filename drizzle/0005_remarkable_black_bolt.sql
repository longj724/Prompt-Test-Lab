CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"encrypted_openai_key" text NOT NULL,
	"encrypted_anthropic_key" text NOT NULL,
	"encrypted_google_key" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;