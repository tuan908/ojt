import {OjtUserRole} from "@/constants";
import {type RecursivelyReplaceNullWithUndefined} from "@/types";
import {clsx, type ClassValue} from "clsx";
import {unstable_noStore} from "next/cache";
import {twMerge} from "tailwind-merge";
import json from "@/dictionaries/jp.json";

export default class Utils {
    public static cn(...inputs: ClassValue[]) {
        return twMerge(clsx(inputs));
    }

    /**
     * Convert role
     * @param role Database stored role
     * @returns Converted string - from role
     */
    public static convertRole(role?: string) {
        switch (role) {
            case OjtUserRole.Counselor:
                return json.role.counselor;

            case OjtUserRole.Parent:
                return json.role.parent;

            case OjtUserRole.Student:
                return json.role.student;

            case OjtUserRole.Teacher:
                return json.role.teacher;

            default:
                throw new Error("Invalid Role");
        }
    }

    public static RestTemplate = class {
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

        public static async get<T>(endpoint: string) {
            const url = `${process.env["SPRING_API"]}${endpoint}`;
            const requestOptions: RequestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            };

            unstable_noStore();

            try {
                const response = await fetch(url, requestOptions);
                const responseJson = (await response.json()) as T;
                return this.nullsToUndefined(responseJson);
            } catch (error: any) {
                console.log(error?.message);
                return undefined;
            }
        }

        public static async post<T>(endpoint: string, body?: unknown) {
            const url = `${process.env["SPRING_API"]}${endpoint}`;
            const requestOptions: RequestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            };

            requestOptions.body = JSON.stringify(body);

            try {
                const response = await fetch(url, requestOptions);
                const responseJson = (await response.json()) as T;
                return this.nullsToUndefined(responseJson);
            } catch (error: any) {
                console.log(error?.message);
                return undefined;
            }
        }

        public static async delete<T>(endpoint: string, body?: unknown) {
            const url = `${process.env["SPRING_API"]}${endpoint}`;
            const requestOptions: RequestOptions = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            };

            requestOptions.body = JSON.stringify(body);

            try {
                const response = await fetch(url, requestOptions);
                const responseJson = (await response.json()) as T;
                return this.nullsToUndefined(responseJson);
            } catch (error: any) {
                console.log(error?.message);
                return undefined;
            }
        }
    };
}

export type HttpMethod = "GET" | "POST" | "DELETE";

interface RequestOptions {
    method: HttpMethod;
    headers: HeadersInit;
    body?: BodyInit | null;
    cache: "no-store";
}
