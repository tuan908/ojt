import { drizzle } from "drizzle-orm/neon-serverless";

declare module "hono" {
    interface ContextVariableMap {
        db: ReturnType<typeof drizzle>;
    }
}

export type Binding = {
    Bindings: {
        [key in keyof CloudflareBindings]: CloudflareBindings[key];
    } & { DATABASE_URL: string };
};

export interface IUpdateComment {
    id: number;
    content: string;
}
