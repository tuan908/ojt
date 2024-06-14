import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { Binding } from "../..";
import * as schema from "../../db/schema";

const app = new Hono<Binding>();

app.get("/", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql, { schema });
  const result = await db.query.hashtag.findMany({
    columns: {
      id: true,
      name: true,
      color: true,
    },
  });
  return c.json({result});
});

export default app;
