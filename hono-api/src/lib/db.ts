import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import schema from "../schema";
import {Context} from "hono";
import {Binding} from "../types";

export default function db(context: Context<Binding>) {
    const connectionString = context.env.DATABASE_URL;
    if (!connectionString) throw new Error("Invalid connection string");

    try {
        const sql = neon(connectionString);
        return drizzle(sql, {schema});
    } catch (error) {
        throw new Error("Failed when connecting to database");
    }
}
