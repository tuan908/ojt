import { Hono } from "hono";
import { Binding } from "..";
import db from "../db";

const app = new Hono<Binding>();

app.get("/events", async (c) => {
  try {
    const result = await db(c.env.DATABASE_URL).query.event.findMany({
      columns: {
        id: true,
        name: true,
      },
    });
    return c.json(result);
  } catch (error) {
    return c.json({ message: "Server error" }, 500);
  }
});

app.get("/grades", async (c) => {
  try {
    const result = await db(c.env.DATABASE_URL).query.grade.findMany({
      columns: {
        id: true,
        name: true,
      },
    });
    return c.json(result);
  } catch (error) {
    return c.json({ message: "Server error" }, 500);
  }
});

app.get("/hashtags", async (c) => {
  try {
    const result = await db(c.env.DATABASE_URL).query.hashtag.findMany({
      columns: {
        id: true,
        name: true,
        color: true,
      },
    });
    return c.json(result);
  } catch (error) {
    return c.json({ message: "Server error" }, 500);
  }
});

export default app;
