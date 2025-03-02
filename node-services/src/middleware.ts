import { Context, Next } from "hono";

/**
 * Logging middleware for Hono
 * Logs incoming requests, execution time, and errors.
 */
export async function loggerMiddleware(ctx: Context, next: Next) {
    const start = Date.now();
    const { method, url } = ctx.req;

    console.log(`[Request] ${method} ${url} - ${new Date().toISOString()}`);

    try {
        await next();

        const duration = Date.now() - start;
        console.log(`[Response] ${method} ${url} - ${ctx.res.status} (${duration}ms)`);
    } catch (error: unknown) {
        console.error(`[Error] ${method} ${url} - ${error instanceof Error ? error.message : error}`);
        ctx.status(500);
        return ctx.json({ message: "Internal Server Error" });
    }
}
