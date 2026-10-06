import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { scores } from "../../db/schema.js";

const LIMIT = 20;
const MAX_SCORE = 10_000_000;
const MAX_LEVEL = 1_000;

async function topScores() {
  return db
    .select({ id: scores.id, name: scores.name, score: scores.score, level: scores.level, createdAt: scores.createdAt })
    .from(scores)
    .orderBy(desc(scores.score), scores.createdAt)
    .limit(LIMIT);
}

export default async (req: Request) => {
  if (req.method === "GET") {
    return Response.json(await topScores(), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (req.method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = String(body?.name ?? "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .trim()
      .slice(0, 16);
    const score = Number(body?.score);
    const level = Number(body?.level);

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    if (!Number.isInteger(score) || score <= 0 || score > MAX_SCORE) {
      return Response.json({ error: "Invalid score" }, { status: 400 });
    }
    if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) {
      return Response.json({ error: "Invalid level" }, { status: 400 });
    }

    const [entry] = await db.insert(scores).values({ name, score, level }).returning({ id: scores.id });
    return Response.json({ id: entry.id, top: await topScores() }, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/scores",
};
