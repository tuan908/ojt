import { tryCatch } from "@/shared/utils";
import { Hono } from "hono";
import { createSuccessResponse } from "../lib/api-response";
import DbSchema from "../schema";
import type { IEnvironment } from "../types";

const eventRouter = new Hono<IEnvironment>();

eventRouter.get("/", async c => {
    const db = c.get("db");
    const queryPromise = db
        .select({ id: DbSchema.Event.id, name: DbSchema.Event.name })
        .from(DbSchema.Event);
    const { data } = await tryCatch(queryPromise);
    if (Array.isArray(data)) {
        return c.json(createSuccessResponse(data), 200);
    }
});

export default eventRouter;
