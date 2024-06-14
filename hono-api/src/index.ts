import { config } from "dotenv";
import { Hono } from "hono";
import students from "./routes/students";
import events from "./routes/common/events";
import hashtags from "./routes/common/hashtags";
import grades from "./routes/common/grades";

config({ path: ".dev.vars" });

export type Binding = {
  Bindings: {
    [key in keyof CloudflareBindings]: CloudflareBindings[key];
  } & { DATABASE_URL: string };
};

const app = new Hono<Binding>().basePath("/api/hono/v1");

app.route("/students", students);
app.route("/common/events", events)
app.route("/common/hashtags", hashtags)
app.route("/common/grades", grades)

export default app;
