import {Hono} from "hono";
import db from "../lib/db";
import type {Binding} from "../types";

const app = new Hono<Binding>();

app.get("/events", async ctx => {
    try {
        const result = await db(ctx).query.event.findMany({
            columns: {
                id: true,
                name: true,
            },
        });
        return ctx.json(result);
    } catch (error) {
        return ctx.json({message: "Server error"}, 500);
    }
});

app.get("/grades", async ctx => {
    try {
        const result = await db(ctx).query.grade.findMany({
            columns: {
                id: true,
                name: true,
            },
        });
        return ctx.json(result);
    } catch (error) {
        return ctx.json({message: "Server error"}, 500);
    }
});

app.get("/hashtags", async ctx => {
    try {
        const result = await db(ctx).query.hashtag.findMany({
            columns: {
                id: true,
                name: true,
                color: true,
            },
        });
        return ctx.json(result);
    } catch (error) {
        return ctx.json({message: "Server error"}, 500);
    }
});

export default app;
