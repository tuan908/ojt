import {eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {ErrorCodes, STRING_EMPTY} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {nullsToUndefined, tryCatch} from '~/shared/utils';
import {createErrorResponse, createSuccessResponse} from '../lib/api-response';
import DbSchema from '../schema';
import type {IHashtagDetailDto} from '../types';

const trackingRouter = new Hono().get('/', async c => {
  const {student_code} = c.req.query();

  const db = c.get('db');

  const [student] = await db
    .select({
      id: DbSchema.Student.id,
      code: DbSchema.Student.code,
      fullname: DbSchema.User.name,
    })
    .from(DbSchema.Student)
    .innerJoin(DbSchema.User, eq(DbSchema.Student.userId, DbSchema.User.id))
    .where(eq(DbSchema.Student.code, student_code!));

  if (!student) {
    return c.json(
      createErrorResponse({
        code: ErrorCodes.NOT_FOUND,
        message: json.error.notFound,
        statusCode: 404,
      }),
    );
  }

  const trackingPromise = db
    .select({
      studentHashtagValue: DbSchema.StudentHashtag.value,
      hashtagName: DbSchema.Hashtag.name,
      fullname: DbSchema.User.name,
    })
    .from(DbSchema.Student)
    .innerJoin(DbSchema.User, eq(DbSchema.Student.userId, DbSchema.User.id))
    .leftJoin(
      DbSchema.StudentHashtag,
      eq(DbSchema.Student.id, DbSchema.StudentHashtag.studentId),
    )
    .leftJoin(
      DbSchema.Hashtag,
      eq(DbSchema.StudentHashtag.hashtagId, DbSchema.Hashtag.id),
    )
    .where(eq(DbSchema.Student.code, student_code!))
    .orderBy(DbSchema.Hashtag.name);

  const {data: rawRows, error} = await tryCatch(trackingPromise);

  if (error || rawRows.length === 0) throw error;

  const rows = rawRows.map(rawRow => ({
    ...rawRow,
    studentHashtagValue: Array.isArray(rawRow.studentHashtagValue)
      ? rawRow.studentHashtagValue
          .map(x => x as IHashtagDetailDto)
          .reduce((sum, x) => sum + x.value, 0)
      : 0,
  }));

  const response = createSuccessResponse(
    nullsToUndefined({
      id: student.id,
      code: student.code,
      name: student.fullname,
      hashtags: {
        doughnut: {
          _data: rows.map(row => ({
            name: row.hashtagName ?? STRING_EMPTY,
            value: row.studentHashtagValue,
          })),
          text: rows
            .reduce(
              (sum, {studentHashtagValue}) => sum + studentHashtagValue,
              0,
            )
            .toString(),
        },
        stacked: rawRows.map(row => ({
          name: row.hashtagName ?? STRING_EMPTY,
          data: Array.isArray(row.studentHashtagValue)
            ? (row.studentHashtagValue as number[])
            : [],
          type: 'bar' as const,
          stack: 'Hashtags',
        })),
      },
    }),
  );

  return c.json(response);
});

export default trackingRouter;
