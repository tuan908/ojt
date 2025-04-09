import {Hono} from 'hono';
import {ErrorCodes} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {tryCatch} from '~/shared/utils';
import {createErrorResponse, createSuccessResponse} from '../lib/api-response';
import DbSchema from '../schema';

const gradeRouter = new Hono().get('/', async c => {
  const db = c.get('db');
  const queryPromise = db
    .select({id: DbSchema.Grade.id, name: DbSchema.Grade.name})
    .from(DbSchema.Grade);
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

export default gradeRouter;
