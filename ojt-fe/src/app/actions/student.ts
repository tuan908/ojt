"use server";

import {EventStatus} from "@/constants";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import {OjtStatusCode} from "@/types";
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
export async function getStudentList(
    dto?: StudentListRequestDto
): Promise<Page<StudentResponseDto>> {
    try {
        // Use raw dto instead of JSON.stringify(dto) - dto already parse
        // to JSON string in fetchNoCache
        const body = !!dto ? dto : {};

        const res = await fetchNoCache("/student", "POST", body);
        const result = await res.json();
        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

/**
 * Get student by code
 * @param studentCode Student code
 * @returns Student Response
 */
export async function getStudentByCode(
    studentCode: string
): Promise<StudentResponseDto | undefined> {
    try {
        const res = await fetchNoCache(`/student/${studentCode}`);
        const result = await res.json();
        return result;
    } catch (error: any) {
        return undefined;
    }
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
    try {
        const response = await fetchNoCache("/event/detail", "POST", dto);
        revalidatePath(`/student/[slug]`, "page");
        const responseBody = await response.json();
        return responseBody;
    } catch (error) {
        return {
            code: OjtStatusCode.Error,
            title: "Server Error",
            message: "Server error, please contact your administrator",
        };
    }
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
        status?: EventStatus[];
    }
): Promise<EventDetailDto[] | undefined> => {
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

    try {
        const response = await fetchNoCache(url, "GET");
        const responseJson = await response.json();
        return responseJson;
    } catch (error: any) {
        return undefined;
    }
};
