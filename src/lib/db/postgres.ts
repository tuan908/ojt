import postgres from "postgres";

/**
 * PostgreSQL
 * @author tuanna
 */
export default class Postgres {
    private static instance = postgres({
        host: process.env.PG_HOST,
        ssl: "require",
        transform: postgres.camel,
    });

    static async query<T extends readonly (object | undefined)[]>(sql: string) {
        try {
            const result = await this.instance<T>`${sql}`;
            return result;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }
}
