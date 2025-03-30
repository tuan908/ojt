import { drizzle } from "drizzle-orm/neon-serverless";

declare module "hono" {
    interface ContextVariableMap {
        db: ReturnType<typeof drizzle>;
    }
}

export interface IEnvironment {
    Bindings: { DATABASE_URL: string };
}

export interface IUpdateComment {
    id: number;
    content: string;
    commentId: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    status: {
        code: number;
        message: string;
    };
    requestId: string;
    timestamp: string;
    data?: T;
    error?: ApiError;
    pagination?: PaginationInfo;
    rateLimit?: RateLimitInfo;
}

export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
    path?: string;
    stack?: string;
    errors?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
    value?: unknown;
}

export interface PaginationInfo {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageUrl?: string;
    previousPageUrl?: string;
}

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
}

export interface IHashtag {
    id: number;
    name: string;
    color: string;
}

export interface IHashtagDetail {
    id: number;
    value: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    status: {
        code: number;
        message: string;
    };
    requestId: string;
    timestamp: string;
    data?: T;
    error?: ApiError;
    pagination?: PaginationInfo;
    rateLimit?: RateLimitInfo;
}

export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
    path?: string;
    stack?: string;
    errors?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
    value?: unknown;
}

export interface PaginationInfo {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageUrl?: string;
    previousPageUrl?: string;
}

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
}
