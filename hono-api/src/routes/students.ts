import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { Binding } from "..";
import db from "../db";
import model from "../db/model";

const app = new Hono<Binding>();

app.get("/", async (c) => {
  try {
    const result = await db(c.env.DATABASE_URL).query.student.findMany({
      columns: {
        id: true,
        code: true,
      },
      orderBy({ code }, { asc }) {
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
    return c.json({ message: "Server error" }, 500);
  }
});

app.get("/:code", async (c) => {
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
    return c.json({ message: "Server error" }, 500);
  }
});

export default app;
