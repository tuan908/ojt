"use server";

import HttpClient from "@/lib/HttpClient";
import {decrypt} from "@/lib/auth";
import type {StudentEventResponse, EventDetail} from "@/types/student.types";
import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {RedirectType, redirect} from "next/navigation";
import {cache} from "react";
import {z} from "zod";

const registerEventSchema = z.object({
    username: z.string(),
    gradeName: z.string(),
    data: z.object({
        eventName: z.string().optional(),
        eventsInSchoolLife: z.string().optional(),
        myAction: z.string().optional(),
        shownPower: z.string().optional(),
        strengthGrown: z.string().optional(),
        myThought: z.string().optional(),
    }),
});

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
        await HttpClient.post("/student/event/register", result.data);
        revalidatePath("/events");
        redirect("/events", RedirectType.push);
    }
}

const commentSchema = z.object({
    id: z.number().optional(),
    eventDetailId: z.number(),
    username: z.string(),
    content: z.string().optional(),
});

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
        `/student/event/comments`,
        dto
    );
    revalidatePath("/event");
    return data;
}

export const getEventDetailById = cache(async (id: number) => {
    const response = await HttpClient.get<EventDetail>(`/student/event/${id}`);
    return response;
});

export async function deleteEventDetailById(
    code: string,
    id: number
): Promise<StudentEventResponse["events"] | undefined> {
    const res = await HttpClient.delete<StudentEventResponse["events"]>(
        `/student/${code}/event/${id}`
    );
    return res;
}

export async function editComment(id: number, content: string) {
    const requestBody = {
        id,
        content,
    };
    const result = await HttpClient.post<{data?: unknown}>(
        "/student/event/comments/p",
        requestBody
    );
    revalidatePath("/event");
    return result;
}

export async function getValidToken() {
    const token = cookies().get("token")?.value;
    if (!token || !(await decrypt(token))) {
        return undefined;
    }

    return await decrypt(token);
}
