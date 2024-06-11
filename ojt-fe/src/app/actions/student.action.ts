"use server";

import HttpClient from "@/configs/http-client.config";
import {KeyPart, OjtEventStatus, PAGE_SIZE} from "@/constants";
import type {
    Page,
    StudentEventResponse,
    StudentsRequest,
    StudentsResponse,
} from "@/types/student.types";
import {revalidatePath, unstable_cache} from "next/cache";

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */
export const getStudents = async (dto?: StudentsRequest) => {
    // Use raw dto instead of JSON.stringify(dto) - dto already parse
    // to JSON string in fetchNoCache
    let body: Record<string, unknown> | undefined;

    if (!dto) {
        body = {};
    } else {
        body = dto;
    }

    const data = await HttpClient.post<Page<StudentsResponse>>("/students", {
        ...body,
        pageNumber: 3,
        pageSize: PAGE_SIZE,
    });
    console.log(data)
    return data;
};

/**
 * Get student by code
 * @param studentCode Student code
 * @returns Student Response
 */
export const getStudentByCode = async (studentCode: string) => {
    const data = await HttpClient.get<StudentEventResponse>(
        `/student/${studentCode}`
    );
    return data;
};

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
    const data = await HttpClient.post("/student/event/detail", dto);
    revalidatePath(`/student/[id]`, "page");
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
    await HttpClient.delete("/student/event/comments/" + dto.id);
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

    const data = await HttpClient.get<StudentEventResponse>(url);
    return data;
};
