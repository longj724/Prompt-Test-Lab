CREATE TABLE "model_tests" (
	"id" text PRIMARY KEY NOT NULL,
	"test_id" text NOT NULL,
	"model" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "test_id" TO "model_test_id";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_test_id_tests_id_fk";
--> statement-breakpoint
ALTER TABLE "model_tests" ADD CONSTRAINT "model_tests_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_model_test_id_model_tests_id_fk" FOREIGN KEY ("model_test_id") REFERENCES "public"."model_tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tests" DROP COLUMN "model";