/**
 * ServerActionResponse
 */
export type ServerActionResponse = {
    data: unknown;
    errors?: Array<{ path: unknown; message: string }>;
};

/**
 * Nullable of type T
 */
export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

/**
 * ErrorResponse
 */
export type ErrorResponse = {
    message: string;
    type: string;
    code: number;
};

/**
 * Status code
 *  - Error
 *  - ResultNotFound
 *  - UpdateError
 *  - UpdateSuccess
 */
export const StatusCode = {
    InternalServerError: 9999,
    ResultNotFound: 0,
    Error: -1,
    Success: 1,
} as const;

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
    searchParams?: { [key: string]: string | string[] | undefined };
};

export type TableDto = {
    code: string;
    name: string;
    year: string;
    event: string;
    hashtag: string;
};
