"use server";

import {CollectionName} from "@/constants";
import {sql} from "@/lib/db";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import type {EventDetailDto, HashtagDto} from "@/types/student.types";

export type GradeDto = {id: number; name: string};

/**
 * Get Grade List
 * @returns Grade List
 */
export async function getGrades() {
    try {
        const list = await sql<GradeDto[]>`
            select
              ${sql("id", "name")}
            from
               ${sql(CollectionName.Grade)}
        `;
        return list;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

/**
 * Get current event
 * @returns Event List
 */
export async function getEvents() {
    const data = await fetchNoCache<EventDetailDto[]>("/event-detail");
    return data;
}

/**
 * Get hashtag list
 * @returns Hashtag list
 */
export async function getHashtags() {
    try {
        const list = await sql<HashtagDto[]>`
            select
                ${sql("id", "name", "color")}
            from
                ${sql(CollectionName.Hashtag)}
        `;
        return list;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
