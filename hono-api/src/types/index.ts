export type Binding = {
    Bindings: {
        [key in keyof CloudflareBindings]: CloudflareBindings[key];
    } & {DATABASE_URL: string};
};

export interface IUpdateComment {
    id: number;
    content: string;
}