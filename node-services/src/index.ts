import { config } from "dotenv";
import { Hono } from "hono";
import { createDbMiddlewareFactory } from "./middlewares/db";
import { loggerMiddleware } from "./middlewares/logger";
import common from "./routes/common";
import students from "./routes/students";
import type { Binding } from "./types";

config({ path: ".dev.vars" });

const app = new Hono<Binding>().basePath("/api/hono/v1");

app.use("*", loggerMiddleware);
app.use("*", createDbMiddlewareFactory())

app.route("/students", students);
app.route("/common", common);

export default app;
