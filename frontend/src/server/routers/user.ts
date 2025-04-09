import {eq} from 'drizzle-orm/expressions';
import {Hono} from 'hono';
import {ErrorCodes} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {createErrorResponse, createSuccessResponse} from '../lib/api-response';
import DbSchema from '../schema';
import {IEnvironment} from '../types';

const userRouter = new Hono<IEnvironment>().get(`/:id`, async c => {
  const db = c.get('db');
  const id = c.req.param('id');
  try {
    const user = await db
      .select()
      .from(DbSchema.User)
      .where(eq(DbSchema.User.id, Number.parseInt(id)));

    if (!user) {
      return c.json({message: 'User not found'}, 404);
    }

    return c.json(createSuccessResponse(user));
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return c.json(
      createErrorResponse({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: json.error.internalServerError,
        statusCode: 500,
      }),
    );
  }
});

export default userRouter;
