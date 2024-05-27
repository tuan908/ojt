import {nullsToUndefined} from "./nullsToUndefined";
import {unstable_noStore} from "next/cache";

export type HttpMethod = "GET" | "POST" | "DELETE";

interface RequestOptions {
    method: HttpMethod;
    headers: HeadersInit;
    body?: BodyInit | null;
    cache: "no-store";
}

/**
 * Makes an API request without caching.
 * @param endpoint API endpoint
 * @param method HTTP method
 * @param body Request body
 * @returns Parsed JSON response
 */
export async function fetchNoCache<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    body?: unknown
) {
    const url = `${process.env["SPRING_API"]}${endpoint}`;
    const requestOptions: RequestOptions = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    };

    if (method === "POST") {
        requestOptions.body = JSON.stringify(body);
    }

    unstable_noStore();

    try {
        const response = await fetch(url, requestOptions);
        const responseJson = (await response.json()) as T;
        return nullsToUndefined(responseJson);
    } catch (error: any) {
        throw new Error(error?.message);
    }
}
