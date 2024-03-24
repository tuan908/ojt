"use server";

import {OjtStatusCode} from "@/types";
import type {
    EventDto,
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
        const body = !!dto ? JSON.stringify(dto) : JSON.stringify({});

        const res = await fetch(process.env["SPRING_API"] + "/student", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
            },
        });
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
        const res = await fetch(
            process.env["SPRING_API"] + "/student/" + studentCode,
            {cache: "no-cache"}
        );
        const result = await res.json();
        return result;
    } catch (error: any) {
        throw new Error(error?.message);
    }
}

export async function getEventList(): Promise<EventDto[]> {
    try {
        const res = await fetch(process.env["SPRING_API"] + "/event");
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
        const response = await fetch(
            process.env["SPRING_API"] + "/event/detail",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dto),
            }
        );
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
