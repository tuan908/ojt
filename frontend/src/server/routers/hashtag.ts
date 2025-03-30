import { tryCatch } from "@/shared/utils";
import { Hono } from "hono";
import { createSuccessResponse } from "../lib/api-response";
import DbSchema from "../schema";
import type { IEnvironment } from "../types";

const hashtagRouter = new Hono<IEnvironment>();

hashtagRouter.get("/", async ctx => {
    const db = ctx.get("db");
    const queryPromise = db
        .select({
            id: DbSchema.Hashtag.id,
            name: DbSchema.Hashtag.name,
            color: DbSchema.Hashtag.color,
        })
        .from(DbSchema.Hashtag);
    const { data } = await tryCatch(queryPromise);
    if (Array.isArray(data)) {
        return ctx.json(createSuccessResponse(data), 200);
    }
});

export default hashtagRouter;