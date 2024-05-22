"use server";

import {OjtEventStatus} from "@/constants";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import type {
    EventDetailDto,
    Page,
    StudentListRequestDto,
    StudentResponseDto,
} from "@/types/student.types";
import {revalidatePath} from "next/cache";

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */
export async function getStudents(dto?: StudentListRequestDto) {
    // Use raw dto instead of JSON.stringify(dto) - dto already parse
    // to JSON string in fetchNoCache
    const body = !!dto ? dto : {};

    const data = await fetchNoCache<Page<StudentResponseDto>>(
        "/student",
        "POST",
        body
    );
    return data;
}

/**
 * Get student by code
 * @param studentCode Student code
 * @returns Student Response
 */
export async function getStudentByCode(studentCode: string) {
    const data = await fetchNoCache<StudentResponseDto>(
        `/student/${studentCode}`
    );
    return data;
}

/**
 * Update Event Status
 * @param dto Update Event Status Dto
 * @param code Student Code
 */
export async function updateEventStatus(dto: {
    id: number;
    updatedBy: string;
    studentId: number;
}) {
    const data = await fetchNoCache("/student/event/detail", "POST", dto);
    revalidatePath(`/student/[slug]`, "page");
    return data;
}

/**
 * Delete comment
 * @param dto Request dto
 */
export async function deleteComment(dto: {
    id: number;
    eventDetailId: number;
    username: string;
}) {
    await fetchNoCache("/student/event/comments/" + dto.id, "DELETE");
    revalidatePath("/student/event/comments");
}

/**
 * Get event by student code
 * @param code Student code
 * @param arg query params
 * @returns events
 */
export const getEventsByStudentCodeWithQuery = async (
    code: string,
    arg: {
        grade?: string;
        eventName?: string;
        status?: OjtEventStatus[];
    }
) => {
    let q = [];
    let url = `/student/${code}/q?`;

    if (arg.grade && arg.grade !== "School Year") {
        q.push(`grade=${arg.grade}`);
    }

    if (arg.eventName && arg.eventName !== "Event") {
        q.push(`event_name=${arg.eventName}`);
    }

    if (arg.status) {
        q.push(`status=${arg.status.map(x => x.toString()).join(",")}`);
    }

    url += q.join("&");

    const data = await fetchNoCache<EventDetailDto[]>(url, "GET");
    return data;
};
