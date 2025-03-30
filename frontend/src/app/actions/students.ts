"use server";

import ApiClient from "@/shared/lib/api-client";
import type { ApiResponse, Student, Students } from "@/shared/types";
import { removeUndefined } from "@/shared/utils";
import { cache } from "react";

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */

type StudentsRequest = Student & { page?: string; limit?: string };

export const getStudents = cache(async (dto?: StudentsRequest) => {
    // Use raw dto instead of JSON.stringify(dto) - dto already parse
    // to JSON string in fetchNoCache

    let params: Record<string, string>;

    if (typeof dto === "undefined") params = {};
    params = { ...removeUndefined<StudentsRequest>(dto!) };

    const data = await ApiClient.Spring.get<ApiResponse<Students[]>>(
        "/students",
        {
            params,
        }
    );

    return data;
});
