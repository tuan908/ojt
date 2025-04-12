import {createCacheMiddleware} from './cache';
import {createDbMiddleware} from './db';
import {createJwtMiddleware} from './jwt';
import {createLogMiddleware} from './logger';

export const MiddlewareFactory = {
  createCacheMiddleware,
  createDbMiddleware,
  createLogMiddleware,
  createJwtMiddleware,
};
