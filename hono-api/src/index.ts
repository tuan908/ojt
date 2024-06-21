import {config} from "dotenv";
import {Hono} from "hono";
import common from "./routes/common";
import students from "./routes/students";
import type {Binding} from "./types";

config({path: ".dev.vars"});

const app = new Hono<Binding>().basePath("/api/hono/v1");

app.route("/students", students);
app.route("/common", common);

export default app;
