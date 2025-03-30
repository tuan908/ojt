/**
 * Nullable of type T
 */
export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

/**
 * LayoutProps
 */
export type LayoutProps = Readonly<{ children: React.ReactNode }>;

export type RecursivelyReplaceNullWithUndefined<T> = T extends null
    ? undefined
    : T extends Date
      ? T
      : {
            [K in keyof T]: T[K] extends (infer U)[]
                ? RecursivelyReplaceNullWithUndefined<U>[]
                : RecursivelyReplaceNullWithUndefined<T[K]>;
        };

/**
 * Dynamic Page Props
 */
export type DynamicPageProps = {
    params: Promise<{ id: string; eventId: number }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

export type Grade = {
    id: number;
    name: string;
};

export type Hashtag = {
    id: number;
    name: string;
    color: string;
};

export interface IEvent {
    id: number;
    name: string;
}

export type Students = Partial<{
    id: number;
    code: string;
    name: string;
    grade: string;
    events: string;
    hashtags: Hashtag[];
}>;

export type Student = Partial<{
    name: string;
    grade: string;
    event: string;
    hashtags: string;
}>;
