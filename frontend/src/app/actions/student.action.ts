"use server";

import { EventStatus, PAGE_SIZE } from "@/constants";
import { honoApi, springApi } from "@/lib/api";
import type {
    Page,
    StudentEvent,
    Student,
    StudentsResponse,
} from "@/types/student";
import type { TrackingData } from "@/types/tracking";
import { revalidatePath } from "next/cache";
import { cache } from "react";

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */
export const getStudents = cache(async (dto?: Student) => {
    // Use raw dto instead of JSON.stringify(dto) - dto already parse
    // to JSON string in fetchNoCache
    let body: Record<string, unknown> | undefined;

    if (!dto) {
        body = {};
    } else {
        body = dto;
    }

    const data = await springApi.post<Page<StudentsResponse>>("/students", {
        ...body,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
    });

    return data;
});

/**
 * Get student by code
 * @param code Student code
 * @returns Student Response
 */
export const getStudentByCode = cache(async (code: string) => {
    const data = await honoApi.get<StudentEvent>(`/students/${code}`);
    return data;
});

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
    const data = await springApi.post(`/students/events/${dto.id}`, dto);
    revalidatePath(`/students/[id]`, "page");
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
    await springApi.delete(
        `/students/events/${dto.eventDetailId}/comments/${dto.id}`
    );
    revalidatePath("/students/event/comments");
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
) => {
    let queryParams = [];
    let url = `/students/${code}?`;

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

    const data = await springApi.get<StudentEvent["events"]>(url);
    return data;
};

export const getTracking = async (code: string) => {
    const data = await honoApi.get<TrackingData>(`/students/${code}/trackings`);
    return data;
};
