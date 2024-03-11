"use server";

import {CollectionName, PAGE_SIZE, SORT_ORDER_ASCENDING} from "@/constants";
import {Astra} from "@/lib/db";

type Event = Array<{
    _id: number;
    id: string;
    name: string;
    status: number;
    comments: number;
}>[number];

type Hashtag = Array<{
    _id: number;
    id: string;
    name: string;
    color: string;
}>[number];

type StudentListResponseDto = Partial<{
    _id: string;
    id: number;
    studentCode: string;
    studentName: string;
    schoolYear: string;
    events: Event[];
    hashtags: Hashtag[];
}>;

type StudentListRequestDto = {
    studentCode: string;
    studentName: string;
    schoolYear: string;
    events: string;
    hashtags: string[];
};

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */
export async function getStudentList(dto?: StudentListRequestDto) {
    try {
        const result = await Astra.find(
            CollectionName.StudentEvent,
            (x: StudentListResponseDto) => x,
            dto,
            {limit: PAGE_SIZE, sort: {studentCode: SORT_ORDER_ASCENDING}}
        );

        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

export type StudentDto = Awaited<ReturnType<typeof getStudentList>>[number];

export async function getStudentByCode(studentCode: string) {
    try {
        const result = await Astra.findOne(CollectionName.StudentEvent, {
            studentCode,
        });
        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}
