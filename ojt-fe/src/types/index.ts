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
    code: string;
    title: string;
    message: string;
};

/**
 * Ojt status code
 *  - Error
 *  - ResultNotFound
 *  - UpdateError
 *  - UpdateSuccess
 */
export enum OjtStatusCode {
    Error = "OJT_0000",
    ResultNotFound = "OJT_0001",
    UpdateError = "OJT_0002",
    UpdateSuccess = "OJT_0003",
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
