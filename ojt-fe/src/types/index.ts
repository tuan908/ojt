/**
 * ServerActionResponseDto
 */
export type ServerActionResponseDto = {
    data: unknown;
    errors?: Array<{path: unknown; message: string}>;
};

/**
 * MaybeNull of type T
 */
export type MaybeNull<T> = {
    [P in keyof T]: T[P] | null;
};

/**
 * MaybeUndefined of type T
 */
export type MaybeUndefined<T> = {
    [P in keyof T]?: T[P];
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
