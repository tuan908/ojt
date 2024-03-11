"use server";

import {Collection} from "@/constants";
import {astraDb} from "@/lib/db";

type Event = Array<{id: number; name: string}>[number];

type Hashtag = Array<{id: number; name: string; color: string}>[number];

type StudentListResponseDto = Partial<{
    _id: string;
    id: number;
    studentCode: string;
    studentName: string;
    schoolYear: string;
    events: string;
    hashtags: string;
    __v: number;
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
        const eventCollection = await astraDb.collection(Collection.Event);
        const list = await eventCollection.find({}).toArray();
        const result = list.map((x: StudentListResponseDto) => ({
            ...x,
            events: x.events ? (JSON.parse(x.events) as Event[]) : [],
            hashtags: x.hashtags ? (JSON.parse(x.hashtags) as Hashtag[]) : [],
        }));

        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

export type StudentDto = Awaited<ReturnType<typeof getStudentList>>[number];

export async function getStudentByCode(studentCode: string) {
    try {
        const eventCollection = await astraDb.collection(Collection.Event);
        const raw = await eventCollection.findOne({studentCode});

        if (!raw) {
            return null;
        } else {
            return {
                ...raw,
                events: raw.events ? (JSON.parse(raw.events) as Event[]) : [],
                hashtags: raw.hashtags
                    ? (JSON.parse(raw.hashtags) as Hashtag[])
                    : [],
            };
        }
    } catch (error: any) {
        throw new Error(error?.message);
    }
}
