import {eq, sql} from "drizzle-orm";
import {Hono} from "hono";
import db from "../lib/db";
import schema from "../schema";
import {Binding} from "../types";

const app = new Hono<Binding>();

app.get("/", async ctx => {
    try {
        const result = await db(ctx).query.student.findMany({
            columns: {
                id: true,
                code: true,
            },
            orderBy({code}, {asc}) {
                return asc(code);
            },
            with: {
                eventDetail: {
                    where: eq(schema.eventDetail.isDeleted, false),
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
    } catch (error) {
        return ctx.json({message: "Server error"}, 500);
    }
});

app.get("/:code", async ctx => {
    const code = ctx.req.param("code");
    try {
        const result = await db(ctx).query.student.findFirst({
            where: eq(schema.student.code, code),
            columns: {
                userId: false,
                gradeId: false,
                isDeleted: false,
                createdAt: false,
                updatedAt: false,
            },
            with: {
                eventDetail: {
                    where: eq(schema.eventDetail.isDeleted, false),
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
                            columns: {
                                id: true,
                                isDeleted: true,
                            },
                        },
                    },
                    columns: {
                        status: true,
                        id: true,
                    },
                    orderBy: ({createdAt}, {asc}) => asc(createdAt),
                },
                user: {
                    columns: {
                        name: true,
                    },
                },
                grade: {
                    columns: {
                        name: true,
                    },
                },
            },
        });
        return ctx.json({
            id: result?.id,
            code: result?.code,
            name: result?.user?.name,
            grade: result?.grade?.name,
            events: result?.eventDetail.map(event => ({
                id: event?.id!,
                grade: event?.grade!?.name,
                name: event?.event!?.name,
                status: event?.status!,
                comments: event?.comments!?.filter(
                    comment => !comment.isDeleted
                ),
            })),
        });
    } catch (error) {
        return ctx.json({message: "Server error"}, 500);
    }
});

app.get("/:code/events/:id", async ctx => {
    const {code, id} = ctx.req.param();

    if (!code || !id) {
        return ctx.json({message: "Invalid param"}, 403);
    }

    try {
        const result = await db(ctx).query.eventDetail.findFirst({
            where: sql`${schema.eventDetail.id} = ${id} and ${schema.eventDetail.isDeleted} = false`,
            columns: {
                id: true,
                data: true,
            },
        });
        return ctx.json(result);
    } catch (error) {
        return ctx.json({message: "Server error"}, 500);
    }
});

app.get("/:code/trackings", async ctx => {
    const {code} = ctx.req.param();
    try {
        let result = await db(ctx).query.student.findFirst({
            where: (fields, {eq}) => eq(fields.code, code),
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
            const _hashtags = result.studentHashtag.sort((a, b) =>
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
                                value: (h.value as HashtagDetail[]).reduce(
                                    (sum: number, a) => sum + a.value,
                                    0
                                ),
                                name: h.hashtag.name,
                            };
                        }),
                        text: _hashtags
                            .map(h =>
                                (h.value as HashtagDetail[]).reduce(
                                    (sum: number, a) => sum + a.value,
                                    0
                                )
                            )
                            .reduce((sum, a) => sum + a, 0),
                    },
                    stacked: _hashtags.map(hashtag => {
                        const data = (hashtag.value as HashtagDetail[]).map(
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
    } catch (error) {
        console.log(error);
        return ctx.json({message: "Server error"}, 500);
    }
});

export default app;

type HashtagDetail = {
    id: number;
    value: number;
};
