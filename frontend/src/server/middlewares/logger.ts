import type {Context, MiddlewareHandler, Next} from 'hono';
import {ErrorCodes} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {tryCatch} from '~/shared/utils';
import {createErrorResponse} from '../lib/api-response';

/**
 * Logging middleware for Hono
 * Logs incoming requests, execution time, and errors.
 */
export function createLogMiddleware(): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const start = Date.now();
    const {method, url} = c.req;

    console.log(`[Request] ${method} ${url} - ${new Date().toISOString()}`);

    const {data: res, error} = await tryCatch(next());

    if (error) {
      console.error(
        `[Error] ${method} ${url} - ${error instanceof Error ? error.message : error}`,
      );
      return c.json(
        createErrorResponse({
          code: ErrorCodes.INTERNAL_SERVER_ERROR,
          message: json.error.internalServerError,
          statusCode: 500,
        }),
        500,
      );
    }

    const duration = Date.now() - start;
    console.log(
      `[Response] ${method} ${url} - ${c.res.status} (${duration}ms)`,
    );
    return res;
  };
}
