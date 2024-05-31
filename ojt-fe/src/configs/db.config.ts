import postgres from "postgres";

const LOCALHOST = "localhost";
const REQUIRE = "require";

export default postgres({
    host: process.env["PGHOST"],
    user: process.env["PGUSER"],
    password: process.env["PGPASSWORD"],
    database: process.env["PGDATABASE"],
    ssl: process.env["PGHOST"] !== LOCALHOST ? REQUIRE : undefined,
    transform: postgres.camel,
});
