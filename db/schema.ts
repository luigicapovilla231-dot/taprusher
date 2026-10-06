import { pgTable, serial, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const scores = pgTable(
  "scores",
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    score: integer().notNull(),
    level: integer().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("scores_score_idx").on(t.score)]
);
