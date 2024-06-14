import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { Binding } from "..";
import * as schema from "../db/schema";

const app = new Hono<Binding>();

app.get("/", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql, { schema });
  const result = await db.query.student.findMany({
    orderBy({ code }, { asc }) {
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
          password: false,
          createdAt: false,
          updatedAt: false,
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
  return c.json({result});
});

app.get("/:code", async (c) => {
  const code = c.req.param("code");
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql, { schema });
  const result = await db.query.student.findFirst({
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
  return c.json({result});
});

export default app;
