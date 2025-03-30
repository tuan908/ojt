"use server";

import type { StudentDto } from "@/features/student/types";
import { EventStatus } from "@/shared/constants";
import ApiClient from "@/shared/lib/api-client";
import type { ApiResponse } from "@/shared/types";
import { cache } from "react";

/**
 * Get student by code
 * @param code Student code
 * @returns Student Response
 */
export const getStudentByCode = cache(async (code: string) => {
    const apiResponse = await ApiClient.Spring.get<ApiResponse<StudentDto>>(
        `/students/${code}`,
        {
            tag: "student",
        }
    );
    return apiResponse?.data;
});

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

    const data = await ApiClient.Spring.get<StudentDto["events"]>(url, {
        tag: "student-events",
    });
    return data;
};
