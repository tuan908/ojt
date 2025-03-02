"use server";

import { type SelectOption } from "@/components/Select";
import API from "@/lib/api";
import type { Grade, Hashtag } from "@/types/common-action.types";
import { cache } from "react";

/**
 * Get Grade List
 * @returns Grade List or empty array if error occurs
 */
export const getGrades = cache(async (): Promise<Grade[]> => {
    try {
        const response = await API.NODE_API.get<Grade[]>("/common/grades", { tag: "grades" });
        return response ?? []; // ✅ Ensure it always returns an array
    } catch (error) {
        console.error("Error fetching grades:", error);
        return []; // ✅ Fallback to empty array
    }
});

/**
 * Get current event list
 * @returns Event List or empty array if error occurs
 */
export const getEvents = cache(async (): Promise<SelectOption[]> => {
    try {
        const response = await API.NODE_API.get<SelectOption[]>("/common/events", { tag: "events" });
        return response ?? [];
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
        const response = await API.NODE_API.get<Hashtag[]>("/common/hashtags", { tag: "hashtags" });
        return response ?? [];
    } catch (error) {
        console.error("Error fetching hashtags:", error);
        return [];
    }
});
