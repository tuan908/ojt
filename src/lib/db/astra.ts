import {AstraDB} from "@datastax/astra-db-ts";

const astraDb = new AstraDB(
    process.env["ASTRA_DB_APPLICATION_TOKEN"],
    process.env["ASTRA_DB_API_ENDPOINT"]
);

export default astraDb;