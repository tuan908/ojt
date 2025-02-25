import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { type Context } from "hono";
import schema from "../schema";
import { type Binding } from "../types";

export default function db(context: Context<Binding>) {
    const connectionString = context.env.DATABASE_URL;
    if (!connectionString) throw new Error("Invalid connection string");

    try {
        const sql = neon(connectionString);
        return drizzle(sql, { schema });
    } catch (error: any) {
        throw new Error("Failed when connecting to database");
    }
}
