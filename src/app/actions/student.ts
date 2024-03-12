"use server";

import {CollectionName} from "@/constants";
import {sql} from "@/lib/db";
import {type MaybeUndefined} from "@/types";

type EventDto = Array<{
    id: string;
    name: string;
    status: number;
    comments: number;
}>[number];

type HashtagDto = Array<{
    id: string;
    name: string;
    color: string;
}>[number];

type StudentListResponseDto = Partial<{
    id: number;
    studentCode: string;
    studentName: string;
    schoolYear: string;
    event: string;
    hashtag: string;
}>;

type StudentListRequestDto = MaybeUndefined<{
    studentName: string;
    schoolYear: string;
    events: string;
    hashtags: string;
}>;

type StudentDto = Awaited<ReturnType<typeof getStudentList>>[number];

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */
export async function getStudentList(dto?: StudentListRequestDto) {
    try {
        let qlString = `
            select
                distinct oa."code" as "studentCode", oa."name" as "studentName", oa."role", ose.event_id as "eventId"
            from
                ojt_student_event ose
            join ojt_account oa on
                oa."id" = ose."student_id"
            where
                1 = 1
        `;

        if (dto?.studentName) {
            qlString += ` and oa."name" = ${dto.studentName} `;
        }

        let studentList = await sql.unsafe<
            {
                id: number;
                studentCode: string;
                studentName: string;
                eventId: string;
            }[]
        >(qlString);
        qlString = "";
        studentList.forEach(async element => {
            qlString = `
                    select
                        oe.id, oe.name
                    from
                        ojt_event oe
                    where
                        oe.id = ${element.eventId}
                `;
            const data =
                await sql.unsafe<{id: number; name: string}[]>(qlString);
            console.log(data);
        });

        if (dto?.schoolYear) {
            qlString += ` and og.grade = ${dto.schoolYear} `;
        }

        if (dto?.events) {
            qlString += ` and oe."name" = ${dto.events} `;
        }

        const result = await sql.unsafe<StudentListResponseDto[]>(qlString);

        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

export async function getStudentByCode(studentCode: string) {
    try {
        let qlString = `
            select
                oa."code" as "studentCode"
                , oa."name" as "studentName"
                , oe."name" as "events"
                , oh."name" as "hashtags"
                , og."name" as "schoolYear"
            from
                ojt_student_event ose
            join ojt_account oa on
                oa.id = ose.student_id
            join ojt_event oe on
                oe.id = ose.event_id
            join ojt_student_hashtag osh on
                osh.student_id = ose.student_id
            join ojt_hashtag oh on
                osh.hashtag_id = oh.id
            join ojt_grade og on
                og.id = oa.grade_id
            where
                og.is_grade = true
                and oa."code" = ${studentCode}
        `;

        const [result] = await sql.unsafe<StudentDto[]>(qlString);
        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

export async function getEventList() {
    try {
        const list = await sql<EventDto[]>`
            select
                ${sql("id", "name")}
            from
                ${sql(CollectionName.Event)}
       `;
        return list;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

export type {EventDto, HashtagDto, StudentDto, StudentListRequestDto};
