import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query";

export const baseApi = createApi({
    reducerPath: "API",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env["NEXT_PUBLIC_URL"],
    }),
    endpoints: () => ({}),
});
