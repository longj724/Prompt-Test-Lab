ALTER TABLE "tests" ALTER COLUMN "model" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."responses" ALTER COLUMN "model" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."model";--> statement-breakpoint
CREATE TYPE "public"."model" AS ENUM('gpt-4.1-nano-2025-04-14', 'gpt-4o-mini-2024-7-18');--> statement-breakpoint
ALTER TABLE "public"."responses" ALTER COLUMN "model" SET DATA TYPE "public"."model" USING "model"::"public"."model";