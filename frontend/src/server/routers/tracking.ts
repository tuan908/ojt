import { tryCatch } from "@/shared/utils";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { createSuccessResponse } from "../lib/api-response";
import DbSchema from "../schema";
import type { IEnvironment, IHashtagDetail } from "../types";

const trackingRouter = new Hono<IEnvironment>();

trackingRouter.get("/", async c => {
    const { studentCode } = c.req.query();

    const db = c.get("db");

    const trackingPromise = db
        .select({
            id: DbSchema.Student.id,
            code: DbSchema.Student.code,
            studentHashtagValue: DbSchema.StudentHashtag.value,
            hashtagName: DbSchema.Hashtag.name,
            fullname: DbSchema.User.name,
        })
        .from(DbSchema.Student)
        .innerJoin(DbSchema.User, eq(DbSchema.Student.userId, DbSchema.User.id))
        .leftJoin(
            DbSchema.StudentHashtag,
            eq(DbSchema.Student.id, DbSchema.StudentHashtag.studentId)
        )
        .leftJoin(
            DbSchema.Hashtag,
            eq(DbSchema.StudentHashtag.hashtagId, DbSchema.Hashtag.id)
        )
        .where(eq(DbSchema.Student.code, studentCode!))
        .orderBy(DbSchema.Hashtag.name);

    const { data: rawRows, error } = await tryCatch(trackingPromise);

    if (error || rawRows.length === 0) throw error;

    const rows = rawRows.map(rawRow => ({
        ...rawRow,
        studentHashtagValue: Array.isArray(rawRow.studentHashtagValue)
            ? rawRow.studentHashtagValue
                  .map(x => x as IHashtagDetail)
                  .reduce((sum, x) => sum + x.value, 0)
            : 0,
    }));

    const response = createSuccessResponse({
        id: rawRows[0]!?.id,
        code: rawRows[0]!?.code,
        name: rawRows[0]!?.fullname,
        hashtags: {
            doughnut: {
                _data: rows.map(row => ({
                    name: row.hashtagName,
                    value: row.studentHashtagValue,
                })),
                text: rows.reduce(
                    (sum, { studentHashtagValue }) => sum + studentHashtagValue,
                    0
                ),
            },
            stacked: rawRows.map(row => ({
                name: row.hashtagName,
                data: row.studentHashtagValue,
                type: "bar",
                stack: "Hashtags",
            })),
        },
    });

    return c.json(response);
});

export default trackingRouter;