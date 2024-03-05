export type ServerActionResponseDto = {
    data: unknown;
    errors?: Array<{path: unknown; message: string}>;
};
