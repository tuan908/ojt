import { config } from "dotenv";
import { Hono } from "hono";
import common from "./routes/common";
import students from "./routes/students";

config({ path: ".dev.vars" });

export type Binding = {
  Bindings: {
    [key in keyof CloudflareBindings]: CloudflareBindings[key];
  } & { DATABASE_URL: string };
};

const app = new Hono<Binding>().basePath("/api/hono/v1");

app.route("/students", students);
app.route("/common", common);

export default app;
