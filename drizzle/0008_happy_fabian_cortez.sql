CREATE TYPE "public"."rating" AS ENUM('good', 'mild', 'bad');--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "rating" text;