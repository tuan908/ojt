/**
 * ServerActionResponseDto
 */
export type ServerActionResponseDto = {
    data: unknown;
    errors?: Array<{path: unknown; message: string}>;
};

/**
 * Nullable of type T
 */
export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

/**
 * ErrorResponseDto
 */
export type ErrorResponseDto = {
    message: string;
    type: string;
    code: number;
};

/**
 * Ojt status code
 *  - Error
 *  - ResultNotFound
 *  - UpdateError
 *  - UpdateSuccess
 */
export enum OjtStatusCode {
    InternalServerError = 500,
    ResultNotFound = 404,
    Error = 0,
    Success = 1,
}

/**
 * LayoutProps
 */
export type LayoutProps = Readonly<{children: React.ReactNode}>;

export type RecursivelyReplaceNullWithUndefined<T> = T extends null
    ? undefined
    : T extends Date
      ? T
      : {
            [K in keyof T]: T[K] extends (infer U)[]
                ? RecursivelyReplaceNullWithUndefined<U>[]
                : RecursivelyReplaceNullWithUndefined<T[K]>;
        };
