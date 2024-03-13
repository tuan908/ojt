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