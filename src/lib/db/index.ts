import postgres from "postgres";

const sql = postgres({
    host: process.env.PG_HOST,
    ssl: "require",
});

export default sql;
