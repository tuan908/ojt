import {eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {nullsToUndefined} from '~/shared/utils';
import {createSuccessResponse} from '../lib/api-response';
import DbSchema from '../schema';

const studentRouter = new Hono().get('/:code', async c => {
  const {code} = c.req.param();
  const db = c.get('db');

  const [student] = await db
    .select({
      id: DbSchema.Student.id,
      code: DbSchema.Student.code,
      name: DbSchema.User.name,
      grade: DbSchema.Grade.name,
    })
    .from(DbSchema.Student)
    .innerJoin(DbSchema.User, eq(DbSchema.Student.userId, DbSchema.User.id))
    .innerJoin(DbSchema.Grade, eq(DbSchema.Student.gradeId, DbSchema.Grade.id))
    .where(eq(DbSchema.Student.code, code));

  return c.json(createSuccessResponse(nullsToUndefined(student)));
});

export default studentRouter;
