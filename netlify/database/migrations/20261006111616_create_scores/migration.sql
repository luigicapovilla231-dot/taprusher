CREATE TABLE "scores" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"score" integer NOT NULL,
	"level" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "scores_score_idx" ON "scores" ("score");