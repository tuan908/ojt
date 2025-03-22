"use server";

import API from "@/lib/api";
import { decrypt } from "@/lib/session";
import { registerEventSchema } from "@/lib/zod";
import { StatusCode } from "@/types";
import type { AddCommentPayload, Comment, RegisterEvent } from "@/types/event";
import type { EventDetail, StudentEvent } from "@/types/student";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { cache } from "react";
import { NewEventFormData } from "../students/[id]/_components/header";

/**
 * Register Event
 * @param dto Register Event Dto
 */
export async function registerEvent(dto: RegisterEvent) {
    const result = await registerEventSchema.safeParseAsync(dto);

    if (!result.success) {
        throw new Error("Internal Server Error");
    } else {
        await API.SPRING_API.post(
            `/students/${dto.studentCode}/events`,
            result.data
        );
        revalidatePath("/events");
        redirect("/events", RedirectType.push);
    }
}

export async function addComment(dto: AddCommentPayload) {
    const data = await API.SPRING_API.post<Comment[]>(
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
        const response = await API.SPRING_API.get<EventDetail>(
            `/students/${studentCode}/events/${eventDetailId}`,
            { tag: "event-details" }
        );
        return response;
    }
);

export async function deleteEventDetailById(
    code: string,
    id: number
): Promise<StudentEvent["events"] | undefined> {
    const res = await API.SPRING_API.delete<StudentEvent["events"]>(
        `/students/${code}/event/${id}`
    );
    return res;
}

export async function editComment(data: Omit<AddCommentPayload, "username">) {
    const requestBody = {
        id: data.id,
        content: data.content,
    };
    const result = await API.SPRING_API.post<{ data?: unknown }>(
        `/students/events/${data.eventDetailId}/comments/${data.id}`,
        requestBody
    );
    revalidatePath("/event");
    return result;
}

export async function addEvent(data: NewEventFormData) {
    const reqCookies = await cookies();
    if (!reqCookies.get("session")) {
        redirect("/login");
    }

    const session = await decrypt(reqCookies.get("session")?.value!);
    const registerEventData: RegisterEvent = {
        username: session?.username!,
        gradeName: session?.grade!,
        studentCode: session?.code!,
        data: data,
    };
    console.log(registerEventData)

    await API.SPRING_API.post(
        `/students/${session?.code}/events`,
        registerEventData
    );
    revalidatePath("/students/[id]", "page");
    return {
        code: StatusCode.Success,
    };
}
