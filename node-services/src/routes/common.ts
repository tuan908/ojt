import { Hono } from "hono";
import db from "../lib/db";
import DbSchema from "../schema";
import type { Binding } from "../types";

const app = new Hono<Binding>();

app.get("/events", async ctx => {
    try {
        const result = await db(ctx)
            .select({ id: DbSchema.Event.id, name: DbSchema.Event.name })
            .from(DbSchema.Event);
        return ctx.json(result);
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : error);
        return ctx.json({ message: "Server error" }, 500);
    }
});

app.get("/grades", async ctx => {
    try {
        const result = await db(ctx).query.Grade.findMany({
            columns: { id: true, name: true },
        });
        return ctx.json(result);
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : error);
        return ctx.json({ message: "Server error" }, 500);
    }
});

app.get("/hashtags", async ctx => {
    try {
        const result = await db(ctx).query.Hashtag.findMany({
            columns: { id: true, name: true, color: true },
        });
        return ctx.json(result);
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : error);
        return ctx.json({ message: "Server error" }, 500);
    }
});

export default app;
