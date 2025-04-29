ALTER TABLE "api_keys" ALTER COLUMN "encrypted_openai_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "encrypted_anthropic_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "encrypted_google_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_unique" UNIQUE("user_id");