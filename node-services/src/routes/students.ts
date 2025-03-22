import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import _db from "../lib/db";
import DbSchema from "../schema";
import { Binding, IUpdateComment } from "../types";

const app = new Hono<Binding>();

app.get("/", async ctx => {
    try {
        const result = await _db(ctx).query.Student.findMany({
            columns: {
                id: true,
                code: true,
            },
            orderBy({ code }, { asc }) {
                return asc(code);
            },
            with: {
                eventDetail: {
                    where: eq(DbSchema.EventDetail.isDeleted, false),
                    columns: {
                        createdAt: false,
                        updatedAt: false,
                    },
                    with: {
                        event: {
                            columns: {
                                name: true,
                            },
                        },
                    },
                },
                user: {
                    columns: {
                        id: true,
                        username: true,
                        role: true,
                        name: true,
                    },
                },
                studentHashtag: {
                    columns: {
                        hashtagId: false,
                        studentId: false,
                    },
                    with: {
                        hashtag: {
                            columns: {
                                id: true,
                                name: true,
                                color: true,
                            },
                        },
                    },
                },
            },
        });
        return ctx.json(result);
    } catch (error: any) {
        return ctx.json({ message: `Server error: ${error?.message}` }, 500);
    }
});

app.get("/:code", async ctx => {
    const code = ctx.req.param("code");
    const db = ctx.get("db");
    /** Limit */
    const pageNumber = Number.parseInt(ctx.req.query("page")!) || 1;
    /** Offset */
    const pageSize = Number.parseInt(ctx.req.query("page_size")!) || 10;
    try {
        const [student] = await db
            .select({
                id: DbSchema.Student.id,
                code: DbSchema.Student.code,
                username: DbSchema.User.name,
                grade: DbSchema.Grade.name,
            })
            .from(DbSchema.Student)
            .innerJoin(
                DbSchema.User,
                eq(DbSchema.Student.userId, DbSchema.User.id)
            )
            .innerJoin(
                DbSchema.Grade,
                eq(DbSchema.Student.gradeId, DbSchema.Grade.id)
            )
            .where(
                sql`${DbSchema.Student.code} = ${code} and ${DbSchema.Student.isDeleted} = false`
            );

        const eventDetails = await _db(ctx).query.EventDetail.findMany({
            where: ({ studentId, isDeleted }, { eq, and }) =>
                and(eq(studentId, student?.id!), eq(isDeleted, false)),
            limit: pageSize,
            offset: (pageNumber - 1) * pageSize,
            with: {
                grade: {
                    columns: {
                        name: true,
                    },
                },
                event: {
                    columns: {
                        name: true,
                    },
                },
                comments: {
                    where: ({ isDeleted }, { eq }) => eq(isDeleted, false),
                },
            },
        });

        return ctx.json({
            id: student?.id,
            code: student?.code,
            name: student?.username,
            grade: student?.grade,
            events: eventDetails
                .sort((a, b) => cb(a?.event!?.name, b?.event!?.name))
                .map(event => ({
                    id: event?.id!,
                    grade: event?.grade!?.name,
                    name: event?.event!?.name,
                    status: event?.status!,
                    comments: event?.comments,
                })),
        });
    } catch (error: any) {
        return ctx.json({ message: "Server error" }, 500);
    }
});

app.get("/:code/events/:id", async ctx => {
    const { code, id } = ctx.req.param();

    if (!code || !id) {
        return ctx.json({ message: "Invalid param" }, 403);
    }

    try {
        const result = await _db(ctx).query.EventDetail.findFirst({
            where: sql`${DbSchema.EventDetail.id} = ${id} and ${DbSchema.EventDetail.isDeleted} = false`,
            columns: {
                id: true,
                data: true,
            },
        });
        return ctx.json(result);
    } catch (error: any) {
        return ctx.json({ message: "Server error" }, 500);
    }
});

app.get("/:code/trackings", async ctx => {
    const { code } = ctx.req.param();
    try {
        let result = await _db(ctx).query.Student.findFirst({
            where: (fields, { eq }) => eq(fields.code, code),
            columns: {
                id: true,
                code: true,
            },
            with: {
                studentHashtag: {
                    columns: {
                        value: true,
                    },
                    with: {
                        hashtag: {
                            columns: {
                                name: true,
                            },
                        },
                    },
                },
                user: {
                    columns: {
                        name: true,
                    },
                },
            },
        });

        let data;

        if (result) {
            const _hashtags = result.studentHashtag?.sort((a, b) =>
                a.hashtag
                    .name!?.toLowerCase()
                    .localeCompare(b.hashtag.name!?.toLowerCase())
            );

            data = {
                id: result.id,
                code: result.code,
                name: result.user.name,
                hashtags: {
                    doughnut: {
                        _data: _hashtags.map(h => {
                            return {
                                value: (h.value as HashtagDetail[])?.reduce(
                                    (sum: number, a) => sum + a.value,
                                    0
                                ),
                                name: h.hashtag.name,
                            };
                        }),
                        text: _hashtags
                            .map(h =>
                                (h.value as HashtagDetail[])?.reduce(
                                    (sum: number, a) => sum + a.value,
                                    0
                                )
                            )
                            .reduce((sum, a) => sum + a, 0),
                    },
                    stacked: _hashtags.map(hashtag => {
                        const data = (hashtag.value as HashtagDetail[])?.map(
                            h => h.value
                        );
                        return {
                            name: hashtag.hashtag.name,
                            data,
                            type: "bar",
                            stack: "Hashtags",
                        };
                    }),
                },
            };
        }

        return ctx.json(data);
    } catch (error: any) {
        console.log(error);
        return ctx.json({ message: "Server error" }, 500);
    }
});

app.post("/:code/events/:eventId/Comments", async ctx => {
    const { code, eventId } = ctx.req.param();
    const data = (await ctx.req.json()) as IUpdateComment;
    try {
        const db = _db(ctx);
        console.log(data);

        const student = await db.query.Student.findFirst({
            where: (fields, { eq }) => eq(fields.code, code),
            with: {
                eventDetail: {
                    where: (fields, { eq }) => eq(fields.id, Number(eventId)),
                    with: {
                        comments: {
                            where: (fields, { eq }) => eq(fields.id, data.id),
                        },
                    },
                },
            },
        });

        if (!student) {
            return ctx.json(
                {
                    message: "Not found any user!",
                },
                404
            );
        }

        await db
            .update(DbSchema.Comment)
            .set({ content: data.content })
            .where(eq(DbSchema.Comment.id, data.id));
        return ctx.json({
            message: "Success",
        });
    } catch (error: any) {
        console.log(error);
        return ctx.json(
            {
                message: "Server error",
            },
            500
        );
    }
});

export default app;

type HashtagDetail = {
    id: number;
    value: number;
};

const cb = (a: string | null, b: string | null) => {
    if (!a || !b) {
        return -1;
    }

    return a.toLowerCase().localeCompare(b.toLowerCase());
};
