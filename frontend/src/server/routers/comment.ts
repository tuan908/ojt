import { tryCatch } from "@/shared/utils";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { ErrorCodes } from "../constants";
import json from "../i18n/locales/ja.json";
import { createErrorResponse } from "../lib/api-response";
import DbSchema from "../schema";
import type { IEnvironment, IUpdateComment } from "../types";

const commentRouter = new Hono<IEnvironment>();

commentRouter.post("/", async c => {
    const db = c.get("db");
    const data = await c.req.json<IUpdateComment>();

    const [comment] = await db
        .select()
        .from(DbSchema.Comment)
        .where(eq(DbSchema.Comment.id, data.commentId));

    if (!comment) {
        return c.json(
            createErrorResponse({
                code: ErrorCodes.NOT_FOUND,
                message: json.error.notFound,
            }),
            404
        );
    }

    const updatePromise = db
        .update(DbSchema.Comment)
        .set({ content: data.content })
        .where(eq(DbSchema.Comment.id, data.id))
        .returning();

    const { error } = await tryCatch(updatePromise);
    if (error) {
        throw error;
    }
});

export default commentRouter;