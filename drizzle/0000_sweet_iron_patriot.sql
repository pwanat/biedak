CREATE TYPE "public"."currency" AS ENUM('PLN');--> statement-breakpoint
CREATE TYPE "public"."expense_status" AS ENUM('pending', 'done', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."income_status" AS ENUM('pending', 'done');--> statement-breakpoint
CREATE TYPE "public"."category_type" AS ENUM('default', 'custom');--> statement-breakpoint
CREATE TABLE "biedak_expense" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "biedak_expense_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(1024),
	"amount" integer NOT NULL,
	"currency" "currency" NOT NULL,
	"status" "expense_status" NOT NULL,
	"occurred_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "biedak_income" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "biedak_income_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(1024),
	"amount" integer NOT NULL,
	"currency" "currency" NOT NULL,
	"status" "income_status" NOT NULL,
	"occurred_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "biedak_category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "biedak_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"label" varchar(256) NOT NULL,
	"user_id" varchar(256),
	"type" "category_type" DEFAULT 'custom' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "biedak_expense" ADD CONSTRAINT "biedak_expense_category_id_biedak_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."biedak_category"("id") ON DELETE no action ON UPDATE no action;