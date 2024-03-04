import {AstraDB} from "@datastax/astra-db-ts";

const db = new AstraDB(
    process.env["ASTRA_DB_APPLICATION_TOKEN"],
    process.env["ASTRA_DB_API_ENDPOINT"]
);

export default db;
