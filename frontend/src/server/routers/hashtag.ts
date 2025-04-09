import {Hono} from 'hono';
import {ErrorCodes} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {tryCatch} from '~/shared/utils';
import {createErrorResponse, createSuccessResponse} from '../lib/api-response';
import DbSchema from '../schema';

const hashtagRouter = new Hono().get('/', async ctx => {
  const db = ctx.get('db');
  const queryPromise = db
    .select({
      id: DbSchema.Hashtag.id,
      name: DbSchema.Hashtag.name,
      color: DbSchema.Hashtag.color,
    })
    .from(DbSchema.Hashtag);
  const {data} = await tryCatch(queryPromise);
  if (Array.isArray(data)) {
    return ctx.json(createSuccessResponse(data), 200);
  }
  return ctx.json(
    createErrorResponse({
      code: ErrorCodes.NOT_FOUND,
      message: json.error.notFound,
    }),
    404,
  );
});

export default hashtagRouter;
