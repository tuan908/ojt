import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from './schema'

const queryClient = postgres({
    host: process.env.PG_HOST,
    ssl: "require",
});

const pg = drizzle(queryClient, {schema});

export default pg;