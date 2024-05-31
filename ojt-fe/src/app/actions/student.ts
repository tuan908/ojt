"use server";

import {OjtEventStatus} from "@/constants";
import type {
    EventDetail,
    StudentsRequest,
    StudentsResponse,
} from "@/types/student.types";
import Utils from "@/utils";
import {revalidatePath} from "next/cache";

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */
export async function getStudents(dto?: StudentsRequest) {
    // Use raw dto instead of JSON.stringify(dto) - dto already parse
    // to JSON string in fetchNoCache
    const body = !!dto ? dto : {};

    const data = await Utils.RestTemplate.post<StudentsResponse[]>(
        "/student",
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
    const data = await Utils.RestTemplate.get<StudentsResponse>(
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
    const data = await Utils.RestTemplate.post("/student/event/detail", dto);
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
    await Utils.RestTemplate.delete("/student/event/comments/" + dto.id);
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
    let queryParams = [];
    let url = `/student/${code}/q?`;

    if (arg.grade && arg.grade !== "School Year") {
        queryParams.push(`grade=${arg.grade}`);
    }

    if (arg.eventName && arg.eventName !== "Event") {
        queryParams.push(`event_name=${arg.eventName}`);
    }

    if (arg.status) {
        queryParams.push(
            `status=${arg.status.map(x => x.toString()).join(",")}`
        );
    }

    url += queryParams.join("&");

    const data = await Utils.RestTemplate.get<EventDetail[]>(url);
    return data;
};
