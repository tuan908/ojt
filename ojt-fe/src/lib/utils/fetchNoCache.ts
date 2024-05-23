import {nullsToUndefined} from "./nullsToUndefined";
import { unstable_noStore } from 'next/cache'

/**
 * fetch with no cache setup
 * @param url Api URL
 * @param method GET | POST | DELETE
 * @param body raw body
 * @returns Response
 */
export async function fetchNoCache<T>(
    endpoint: string,
    method?: "GET" | "POST" | "DELETE",
    body?: unknown
) {
    const url = `${process.env["SPRING_API"]}${endpoint}`;
    unstable_noStore();
    try {
        let response;
        if (method && method === "POST") {
            response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                cache: "no-cache",
            });
        } else {
            response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-cache",
            });
        }
        const responseJson = (await response.json()) as T;
        return nullsToUndefined(responseJson);
    } catch (error: any) {
        throw new Error(error?.message);
    }
}
