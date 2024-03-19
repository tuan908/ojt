"use server";

import type {
    EventDto,
    Page,
    StudentListRequestDto,
    StudentResponseDto,
} from "@/types/student.types";

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */
export async function getStudentList(
    dto?: StudentListRequestDto
): Promise<Page<StudentResponseDto>> {
    try {
        const body = JSON.stringify(dto);

        const res = await fetch(process.env["SPRING_API"] + "/student", {
            method: "POST",
            body,
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
            process.env["SPRING_API"] + "/student/" + studentCode
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
