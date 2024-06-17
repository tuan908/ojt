import { type RecursivelyReplaceNullWithUndefined } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export type HttpMethod = "GET" | "POST" | "DELETE";

interface RequestOptions {
    method: HttpMethod;
    headers: HeadersInit;
    body?: BodyInit | null;
    cache: "no-store";
}

export default class HttpClient {
    private static getRequestOptions = (
        method: HttpMethod,
        body?: string
    ): RequestOptions => {
        return {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
            body: method === "POST" ? body : undefined,
        };
    };

    public static nullsToUndefined<T>(
        obj: T
    ): RecursivelyReplaceNullWithUndefined<T> {
        if (obj === null) {
            return undefined as any;
        }

        // object check based on: https://stackoverflow.com/a/51458052/6489012
        if (obj?.constructor.name === "Object") {
            for (let key in obj) {
                obj[key] = this.nullsToUndefined(obj[key]) as any;
            }
        }
        return obj as any;
    }

    /**
     * GET
     * @param endpoint endpoint
     * @param base base url
     * @returns Typed response;
     */
    public static async get<T>(endpoint: string, base?: "node" | "spring") {
        let url;
        if (!base || base == "spring") {
            url = process.env["SPRING_API"] + endpoint;
        } else {
            url = process.env["HONO_API"] + endpoint;
        }

        noStore();

        try {
            const response = await fetch(url, this.getRequestOptions("GET"));
            const responseJson = (await response.json()) as T;
            return this.nullsToUndefined(responseJson);
        } catch (error: any) {
            console.log(error?.message);
            return undefined;
        }
    }

    public static async post<T>(endpoint: string, body?: unknown) {
        const url = process.env["SPRING_API"] + endpoint;

        noStore();

        try {
            const response = await fetch(
                url,
                this.getRequestOptions("POST", JSON.stringify(body))
            );
            const responseJson = (await response.json()) as T;
            return this.nullsToUndefined(responseJson);
        } catch (error: any) {
            console.log(error?.message);
            return undefined;
        }
    }

    public static async delete<T>(endpoint: string, body?: unknown) {
        const url = process.env["SPRING_API"] + endpoint;

        try {
            const response = await fetch(url, this.getRequestOptions("DELETE"));
            const responseJson = (await response.json()) as T;
            return this.nullsToUndefined(responseJson);
        } catch (error: any) {
            console.log(error?.message);
            return undefined;
        }
    }
}
