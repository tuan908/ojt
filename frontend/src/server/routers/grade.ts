import { tryCatch } from "@/shared/utils";
import { Hono } from "hono";
import { createSuccessResponse } from "../lib/api-response";
import DbSchema from "../schema";
import type { IEnvironment } from "../types";

const gradeRouter = new Hono<IEnvironment>();

gradeRouter.get("/", async c => {
    const db = c.get("db");
    const queryPromise = db
        .select({ id: DbSchema.Grade.id, name: DbSchema.Grade.name })
        .from(DbSchema.Grade);
    const { data } = await tryCatch(queryPromise);
    if (Array.isArray(data)) {
        return c.json(createSuccessResponse(data), 200);
    }
});

export default gradeRouter;