export type Binding = {
    Bindings: {
        [key in keyof CloudflareBindings]: CloudflareBindings[key];
    } & {DATABASE_URL: string};
};
