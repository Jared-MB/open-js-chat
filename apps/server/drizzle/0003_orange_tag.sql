ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "externalId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "username";