"use server";

import type {
    RegisterEvent,
    StudentDto,
    StudentEvent,
} from "@/features/student/types";
import { StudentEventSchema } from "@/features/student/validations";
import ApiClient from "@/shared/lib/api-client";
import type { ApiResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";

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
    const data = await ApiClient.Spring.post(`/students/events/${dto.id}`, dto);
    return data;
}

/**
 * Register Event
 * @param dto Register Event Dto
 */
export async function createEvent(dto: RegisterEvent) {
    const result = await StudentEventSchema.safeParseAsync(dto);

    if (!result.success) {
        throw new Error("Internal Server Error");
    } else {
        await ApiClient.Spring.patch(
            `/students/${dto.studentCode}/events`,
            result.data
        );
        redirect("/events", RedirectType.push);
    }
}

export const getStudentEvent = cache(
    async ({
        studentCode,
        studentEventId,
    }: Readonly<{
        studentCode: string;
        studentEventId: string;
    }>) => {
        const response = await ApiClient.Spring.get<ApiResponse<StudentEvent>>(
            `/student-events`,
            {
                tag: "event-details",
                params: {
                    studentCode,
                    studentEventId,
                },
            }
        );
        return response?.data;
    }
);

export async function deleteEventDetailById(
    id: number
): Promise<StudentDto["events"] | undefined> {
    const res = await ApiClient.Spring.delete<StudentDto["events"]>(
        `/events/${id}`
    );
    return res;
}

export async function addEvent(data: RegisterEvent) {
    const { data: result } = await tryCatch(
        ApiClient.Spring.post(`/events`, data)
    );
    console.log(data);
    return {
        code: "ok",
    };
}

export async function deleteComment({
    studentEventId,
    commentId,
}: {
    studentEventId: number;
    commentId: number;
}) {
    const { data, error } = await tryCatch(
        ApiClient.Hono.delete(`/events/${studentEventId}/comments/${commentId}`)
    );
    console.log(data);
    console.log(error);
    return {};
}

export async function addComment(data: {
    studentEventId: number;
    username: string;
    id?: number | undefined;
    content?: string | undefined;
}) {
    const response = await ApiClient.Spring.post<ApiResponse>(
        `/student-events/${data.studentEventId}/comments`,
        data
    );
    return response;
}

export async function editComment(p0: {
    id: number;
    content: string;
    studentEventId: number;
}) {
    const response = await ApiClient.Spring.patch(
        `/student-events/${p0.studentEventId}/comments`,
        p0
    );
    return response;
}
