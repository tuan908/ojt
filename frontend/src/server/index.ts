import {Hono} from 'hono';
import {env} from '../../env.mjs';
import {MiddlewareFactory} from './middlewares';
import commentRouter from './routers/comment';
import eventRouter from './routers/event';
import gradeRouter from './routers/grade';
import hashtagRouter from './routers/hashtag';
import studentRouter from './routers/student';
import trackingRouter from './routers/tracking';
import userRouter from './routers/user';
import type {IEnvironment} from './types';

const app = new Hono<IEnvironment>().basePath('/api/hono/v1');

const dbMiddleware = MiddlewareFactory.createDbMiddleware(env.DATABASE_URL);
const cacheMiddleware = MiddlewareFactory.createCacheMiddleware({
  REDIS_URL: env.REDIS_URL,
  REDIS_TOKEN: env.REDIS_TOKEN,
  ttl: 300, // 5 minutes
});
const jwtMiddleware = MiddlewareFactory.createJwtMiddleware({
  secret: env.JWT_TOKEN_SECRET,
  algorithm: 'HS256',
});
const logMiddleware = MiddlewareFactory.createLogMiddleware();

app.use('*', jwtMiddleware);
app.use('*', dbMiddleware);
app.use('*', cacheMiddleware);
app.use('*', logMiddleware);

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
