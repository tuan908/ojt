"use server";

import ApiClient from "@/shared/lib/api-client";
import type { ApiResponse, Grade, Hashtag, IEvent } from "@/shared/types";
import { cache } from "react";

/**
 * Get Grade List
 * @returns Grade List or empty array if error occurs
 */
export const getGrades = cache(async (): Promise<Grade[]> => {
    try {
        const response = await ApiClient.Hono.get<ApiResponse<Grade[]>>(
            "/grades",
            {
                tag: "grades",
            }
        );
        return response?.data ?? []; // ✅ Ensure it always returns an array
    } catch (error) {
        console.error("Error fetching grades:", error);
        return []; // ✅ Fallback to empty array
    }
});

/**
 * Get current event list
 * @returns Event List or empty array if error occurs
 */
export const getEvents = cache(async (): Promise<IEvent[]> => {
    try {
        const response = await ApiClient.Hono.get<ApiResponse<IEvent[]>>(
            "/events",
            { tag: "events" }
        );
        return response?.data ?? [];
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
});

/**
 * Get hashtag list
 * @returns Hashtag list or empty array if error occurs
 */
export const getHashtags = cache(async (): Promise<Hashtag[]> => {
    try {
        const response = await ApiClient.Hono.get<ApiResponse<Hashtag[]>>(
            "/hashtags",
            {
                tag: "hashtags",
            }
        );
        return response?.data ?? [];
    } catch (error) {
        console.error("Error fetching hashtags:", error);
        return [];
    }
});
