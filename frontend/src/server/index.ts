import {Hono} from 'hono';
import {createCacheMiddlewareFactory} from './middlewares/cache';
import {createDbMiddlewareFactory} from './middlewares/db';
import {loggerMiddleware} from './middlewares/logger';
import commentRouter from './routers/comment';
import eventRouter from './routers/event';
import gradeRouter from './routers/grade';
import hashtagRouter from './routers/hashtag';
import studentRouter from './routers/student';
import trackingRouter from './routers/tracking';
import userRouter from './routers/user';
import type {IEnvironment} from './types';

const app = new Hono<IEnvironment>().basePath('/api/hono/v1');

const dbMiddleware = createDbMiddlewareFactory(process.env.DATABASE_URL);
const cacheMiddleware = createCacheMiddlewareFactory({
  REDIS_URL: process.env.REDIS_URL,
  REDIS_TOKEN: process.env.REDIS_TOKEN,
  ttl: 300, // 5 minutes
});

app.use('*', loggerMiddleware);
app.use('*', dbMiddleware);
app.use('*', cacheMiddleware);

const route = app
  .route('/students', studentRouter)
  .route('/comments', commentRouter)
  .route('/events', eventRouter)
  .route('/grades', gradeRouter)
  .route('/hashtags', hashtagRouter)
  .route('/trackings', trackingRouter)
  .route('/users', userRouter);

export default app;

export type AppType = typeof route;
