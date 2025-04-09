import {drizzle} from 'drizzle-orm/neon-serverless';

declare module 'hono' {
  interface ContextVariableMap {
    db: ReturnType<typeof drizzle>;
  }
}

export interface IEnvironment {
  Bindings: {DATABASE_URL: string; REDIS_URL: string; REDIS_TOKEN: string};
}

export interface IUpdateCommentDto {
  id: number;
  content: string;
  commentId: number;
}

export interface IHashtagDetailDto {
  id: number;
  value: number;
}

export interface IRateLimitInfoDto {
  limit: number;
  remaining: number;
  reset: number;
}
