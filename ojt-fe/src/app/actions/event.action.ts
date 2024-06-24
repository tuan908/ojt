"use server";

import HttpClient from "@/lib/HttpClient";
import {decrypt} from "@/lib/auth";
import {commentSchema, registerEventSchema} from "@/lib/zod";
import type {EventDetail, StudentEventResponse} from "@/types/student.types";
import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {RedirectType, redirect} from "next/navigation";
import {cache} from "react";
import {z} from "zod";

/**
 * RegisterEventDto
 */
export type RegisterEvent = z.infer<typeof registerEventSchema>;

/**
 * Register Event
 * @param dto Register Event Dto
 */
export async function registerEvent(dto: RegisterEvent) {
    const result = await registerEventSchema.safeParseAsync(dto);

    if (!result.success) {
        throw new Error("Internal Server Error");
    } else {
        await HttpClient.post("/students/event", result.data);
        revalidatePath("/events");
        redirect("/events", RedirectType.push);
    }
}

export type AddCommentPayload = z.infer<typeof commentSchema>;

export type Comment = AddCommentPayload & {
    id: number;
    name: string;
    roleName: string;
    createdAt: string;
    isDeleted: boolean;
};

export async function addComment(dto: AddCommentPayload) {
    const data = await HttpClient.post<Comment[]>(
        `/students/event/comments`,
        dto
    );
    revalidatePath("/event");
    return data;
}

export const getEventDetailById = cache(async (id: number) => {
    const response = await HttpClient.get<EventDetail>(`/students/event/${id}`);
    return response;
});

export async function deleteEventDetailById(
    code: string,
    id: number
): Promise<StudentEventResponse["events"] | undefined> {
    const res = await HttpClient.delete<StudentEventResponse["events"]>(
        `/students/${code}/event/${id}`
    );
    return res;
}

export async function editComment(id: number, content: string) {
    const requestBody = {
        id,
        content,
    };
    const result = await HttpClient.post<{data?: unknown}>(
        "/students/event/comments/p",
        requestBody
    );
    revalidatePath("/event");
    return result;
}

/**
 * getSession
 * @returns Session payload
 */
export async function getSession() {
    const token = cookies().get("token")?.value;
    if (!token || !(await decrypt(token))) {
        return undefined;
    }

    return await decrypt(token);
}
