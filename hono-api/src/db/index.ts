import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import model from "./model";

export default function db(connectionString: string) {
    if (!connectionString) throw new Error("Invalid connection string");

    try {
        const sql = neon(connectionString);
        return drizzle(sql, {schema: model});
    } catch (error) {
        throw new Error("Failed when connecting to database");
    }
}

export {default as model} from "./model";
