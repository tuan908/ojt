import {and, asc, eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {ICreateCommentDto} from '~/features/comment/types';
import {ErrorCodes} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {nullsToUndefined, tryCatch} from '~/shared/utils';
import {env} from '../../../env.mjs';
import {createErrorResponse, createSuccessResponse} from '../lib/api-response';
import {invalidateCache} from '../lib/cache';
import DbSchema from '../schema';
import type {IUpdateCommentDto} from '../types';

const commentRouter = new Hono()
  .get('/', async c => {
    const db = c.get('db');
    const {student_event_id} = c.req.query();
    const comments = await db
      .select({
        id: DbSchema.Comment.id,
        name: DbSchema.User.name,
        roleName: DbSchema.User.userRole,
        createdAt: DbSchema.Comment.createdAt,
        username: DbSchema.User.username,
        content: DbSchema.Comment.content,
      })
      .from(DbSchema.Comment)
      .innerJoin(
        DbSchema.StudentEvent,
        eq(DbSchema.Comment.studentEventId, DbSchema.StudentEvent.id),
      )
      .rightJoin(DbSchema.User, eq(DbSchema.Comment.userId, DbSchema.User.id))
      .where(
        and(
          eq(DbSchema.StudentEvent.id, Number(student_event_id!)),
          eq(DbSchema.Comment.isDeleted, false),
        ),
      )
      .orderBy(asc(DbSchema.Comment.id));

    return c.json(
      createSuccessResponse(comments.map(x => nullsToUndefined(x))),
    );
  })
  .post('/', async c => {
    const db = c.get('db');
    const req = await c.req.json<ICreateCommentDto>();

    const [user] = await db
      .select({id: DbSchema.User.id})
      .from(DbSchema.User)
      .where(eq(DbSchema.User.username, req.username));
    if (!user) {
      return c.json(
        createErrorResponse({
          code: ErrorCodes.NOT_FOUND,
          message: json.error.notFound,
        }),
        404,
      );
    }
    const [newComment] = await db
      .insert(DbSchema.Comment)
      .values({
        content: req.content,
        studentEventId: req.studentEventId,
        userId: user.id,
      })
      .returning();
    await invalidateCache(env.REDIS_URL!, env.REDIS_TOKEN!);

    return c.json(createSuccessResponse({id: newComment!?.id}));
  })
  .put('/:id', async c => {
    const db = c.get('db');
    const req = await c.req.json<IUpdateCommentDto>();

    const [comment] = await db
      .select()
      .from(DbSchema.Comment)
      .where(eq(DbSchema.Comment.id, req.commentId));

    if (!comment) {
      return c.json(
        createErrorResponse({
          code: ErrorCodes.NOT_FOUND,
          message: json.error.notFound,
        }),
        404,
      );
    }

    const updatedCommentPromise = db
      .update(DbSchema.Comment)
      .set({content: req.content})
      .where(eq(DbSchema.Comment.id, req.commentId))
      .returning();

    const {error} = await tryCatch(updatedCommentPromise);
    if (error) {
      throw error;
    }

    await invalidateCache(env.REDIS_URL!, env.REDIS_TOKEN!);

    return c.json(
      createSuccessResponse<{id: number}>({
        id: comment.id,
      }),
      200,
    );
  })
  .delete('/:id', async c => {
    const {studentEventId, commentId} = await c.req.json<{
      studentEventId: number;
      commentId: number;
    }>();
    const db = c.get('db');

    const [comment] = await db
      .select({id: DbSchema.Comment.id})
      .from(DbSchema.Comment)
      .innerJoin(
        DbSchema.StudentEvent,
        eq(DbSchema.StudentEvent.id, DbSchema.Comment.studentEventId),
      )
      .where(
        and(
          eq(DbSchema.Comment.id, commentId),
          eq(DbSchema.StudentEvent.id, studentEventId),
        ),
      );

    if (!comment) {
      return c.json(
        createErrorResponse({
          code: ErrorCodes.NOT_FOUND,
          message: json.error.notFound,
        }),
      );
    }

    await db
      .update(DbSchema.Comment)
      .set({isDeleted: true})
      .where(eq(DbSchema.Comment.id, commentId))
      .returning();

    await invalidateCache(env.REDIS_URL!, env.REDIS_TOKEN!);

    return c.json(createSuccessResponse({id: commentId}, {code: 200}));
  });
export default commentRouter;
