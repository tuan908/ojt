import {Hono} from 'hono';
import {ErrorCodes} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {tryCatch} from '~/shared/utils';
import {createErrorResponse, createSuccessResponse} from '../lib/api-response';
import DbSchema from '../schema';

const eventRouter = new Hono().get('/', async c => {
  const db = c.get('db');
  const queryPromise = db
    .select({
      id: DbSchema.Event.id,
      title: DbSchema.Event.title,
      name: DbSchema.Event.name,
    })
    .from(DbSchema.Event);
  const {data} = await tryCatch(queryPromise);
  if (Array.isArray(data)) {
    return c.json(createSuccessResponse(data), 200);
  }
  return c.json(
    createErrorResponse({
      code: ErrorCodes.NOT_FOUND,
      message: json.error.notFound,
    }),
    404,
  );
});

export default eventRouter;
