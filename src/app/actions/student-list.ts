"use server";

import {Collection} from "@/constants";
import db from "@/lib/db";

export type SearchStudentListDto = Partial<{
    _id: string;
    id: number;
    studentCode: string;
    studentName: string;
    schoolYear: string;
    events: string[];
    hashtags: {name: string; color: string};
    __v: number;
}>;

export async function getStudentList(dto?: SearchStudentListDto) {
    const eventCollection = await db.collection(Collection.Event);
    const list = (await eventCollection
        .find({...dto})
        .toArray()) as SearchStudentListDto[];
    return list;
}
