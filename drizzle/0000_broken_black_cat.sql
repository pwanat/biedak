CREATE TYPE "public"."currency" AS ENUM('PLN');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'done', 'rejected');--> statement-breakpoint
CREATE TABLE "biedak_expense" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "biedak_expense_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(1024),
	"amount" integer NOT NULL,
	"currency" "currency" NOT NULL,
	"status" "status" NOT NULL,
	"occurred_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
