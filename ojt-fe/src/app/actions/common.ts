"use server";

import {CollectionName} from "@/constants";
import {sql} from "@/lib/db";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import {type EventDetailDto} from "@/types/student.types";

export type GradeDto = {id: number; name: string};

/**
 * Get Grade List
 * @returns Grade List
 */
export async function getGradeList() {
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
        return null;
    }
}

/**
 * Get current event
 * @returns Event List
 */
export async function getEventList(): Promise<EventDetailDto[]> {
    try {
        const res = await fetchNoCache("/event-detail");
        const result = await res.json();
        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}
