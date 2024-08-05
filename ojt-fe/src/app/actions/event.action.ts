"use server";

import {DEFAULT_EVENT_OPTION} from "@/constants";
import json from "@/i18n/jp.json";
import {springApi} from "@/lib/api";
import {decrypt} from "@/lib/auth";
import {registerEventSchema} from "@/lib/zod";
import {StatusCode} from "@/types";
import type {
    AddCommentPayload,
    Comment,
    RegisterEvent,
} from "@/types/event-action.types";
import type {EventDetail, StudentEventResponse} from "@/types/student";
import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {RedirectType, redirect} from "next/navigation";
import {cache} from "react";

/**
 * Register Event
 * @param dto Register Event Dto
 */
export async function registerEvent(dto: RegisterEvent) {
    const result = await registerEventSchema.safeParseAsync(dto);

    if (!result.success) {
        throw new Error("Internal Server Error");
    } else {
        await springApi.post("/students/events", result.data);
        revalidatePath("/events");
        redirect("/events", RedirectType.push);
    }
}

export async function addComment(dto: AddCommentPayload) {
    const data = await springApi.post<Comment[]>(
        `/students/events/${dto.eventDetailId}/comments`,
        dto
    );
    revalidatePath("/event");
    return data;
}

export const getEventDetailById = cache(
    async ({
        studentCode,
        eventDetailId,
    }: Readonly<{
        studentCode: string;
        eventDetailId: number;
    }>) => {
        const response = await springApi.get<EventDetail>(
            `/students/${studentCode}/events/${eventDetailId}`
        );
        return response;
    }
);

export async function deleteEventDetailById(
    code: string,
    id: number
): Promise<StudentEventResponse["events"] | undefined> {
    const res = await springApi.delete<StudentEventResponse["events"]>(
        `/students/${code}/event/${id}`
    );
    return res;
}

export async function editComment(data: Omit<AddCommentPayload, "username">) {
    const requestBody = {
        id: data.id,
        content: data.content,
    };
    const result = await springApi.post<{data?: unknown}>(
        `/students/events/${data.eventDetailId}/comments/${data.id}`,
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

export async function addEvent(_prevState: unknown, formData: FormData) {
    if (!cookies().get("token")) {
        redirect("/login");
    }
    const auth = await decrypt(cookies().get("token")?.value!);
    const rawFormData = Object.fromEntries(formData) as RegisterEvent["data"];
    if (formData.get("eventName") === DEFAULT_EVENT_OPTION) {
        return {
            code: StatusCode.Error,
            data: rawFormData,
            error: {
                event: json.error.select_event_required,
            },
        };
    }
    const registerEventData: RegisterEvent = {
        username: auth?.username!,
        gradeName: auth?.grade!,
        studentCode: auth?.code!,
        data: rawFormData,
    };

    await springApi.post(`/students/${auth?.code}/events`, registerEventData);
    revalidatePath("/students/[id]", "page");
    return {
        code: StatusCode.Success,
    };
}
