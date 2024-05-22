import postgres from "postgres";

export const sql = postgres({
    host: process.env["PGHOST"],
    user: process.env["PGUSER"],
    password: process.env["PGPASSWORD"],
    database: process.env["PGDATABASE"],
    ssl: process.env["PGHOST"] !== "localhost" ? "require" : undefined,
    transform: postgres.camel,
});
