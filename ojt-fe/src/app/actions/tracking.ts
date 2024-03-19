"use server";

import {CollectionName} from "@/constants";
import {sql} from "@/lib/db";
import {type HashtagDto} from "@/types/student.types";

export type GradeDto = {id: number; name: string};

export async function getHashtagList() {
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
        return null;
    }
}

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
