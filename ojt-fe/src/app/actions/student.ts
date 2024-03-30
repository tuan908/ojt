"use server";

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

export async function getStudentByCode(
    studentCode: string
): Promise<StudentResponseDto | null> {
    try {
        const res = await fetchNoCache(`/student/${studentCode}`);
        const result = await res.json();
        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

export async function getEventList(): Promise<EventDetailDto[]> {
    try {
        const res = await fetchNoCache("/event-detail");
        const result = await res.json();
        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

/**
 * Update Event Status
 * @param dto Update Event Status Dto
 * @param code Student Code
 * @author Tuanna
 */
export async function updateEventStatus(dto: {
    id: number;
    updatedBy: string;
    studentId: string;
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

export async function deleteComment(dto: {
    id: number;
    eventDetailId: number;
    username: string;
}) {
    await fetchNoCache("/student/event/comments/" + dto.id, "POST", dto);
    revalidatePath("/student/event/comments");
}
