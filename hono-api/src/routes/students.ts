import {eq, sql} from "drizzle-orm";
import {Hono} from "hono";
import {Binding} from "..";
import db from "../db";
import model from "../db/model";

const app = new Hono<Binding>();

app.get("/", async c => {
    try {
        const result = await db(c.env.DATABASE_URL).query.student.findMany({
            columns: {
                id: true,
                code: true,
            },
            orderBy({code}, {asc}) {
                return asc(code);
            },
            with: {
                eventDetail: {
                    where: eq(model.eventDetail.isDeleted, false),
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
        return c.json(result);
    } catch (error) {
        return c.json({message: "Server error"}, 500);
    }
});

app.get("/:code", async c => {
    const code = c.req.param("code");
    try {
        const result = await db(c.env.DATABASE_URL).query.student.findFirst({
            where: eq(model.student.code, code),
            columns: {
                userId: false,
                gradeId: false,
                isDeleted: false,
                createdAt: false,
                updatedAt: false,
            },
            with: {
                eventDetail: {
                    where: eq(model.eventDetail.isDeleted, false),
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
                    },
                    columns: {
                        status: true,
                        id: true,
                    },
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
        return c.json(result);
    } catch (error) {
        return c.json({message: "Server error"}, 500);
    }
});

app.get("/:code/events/:id", async c => {
    const {code, id} = c.req.param();

    if (!code || !id) {
        return c.json({message: "Invalid param"}, 403);
    }

    try {
        const result = await db(c.env.DATABASE_URL).query.eventDetail.findFirst(
            {
                where: sql`${model.eventDetail.id} = ${id} and ${model.eventDetail.isDeleted} = false`,
                columns: {
                    id: true,
                    data: true,
                },
            }
        );
        return c.json(result);
    } catch (error) {
        return c.json({message: "Server error"}, 500);
    }
});

app.get("/:code/trackings", async c => {
    const {code} = c.req.param();
    try {
        let result = await db(c.env.DATABASE_URL).query.student.findFirst({
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
                count:
                    _hashtags.length > 0
                        ? _hashtags
                              .map(h => h.value)
                              .filter((x): x is number => Boolean(x))
                              .reduce((a, b) => a + b)
                        : 0,
                hashtags: _hashtags.map(h => ({
                    name: h.hashtag.name,
                    value: h.value,
                })),
            };
        }

        return c.json(data);
    } catch (error) {
        console.log(error);
        return c.json({message: "Server error"}, 500);
    }
});

export default app;
