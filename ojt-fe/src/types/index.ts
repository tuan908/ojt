export type ServerActionResponseDto = {
    data: unknown;
    errors?: Array<{path: unknown; message: string}>;
};

export type MaybeNull<T> = {
    [P in keyof T]: T[P] | null;
};

export type MaybeUndefined<T> = {
    [P in keyof T]?: T[P];
};

export type ErrorResponseDto = {
    code: string;
    title: string;
    message: string;
}

export enum OjtStatusCode {
    Error = "OJT_0000",
    ResultNotFound= "OJT_0001",
    UpdateError = "OJT_0002",
    UpdateSuccess = "OJT_0003",
}
