"use server";

import {verifyJwtToken} from "@/lib/auth";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import {type EventDetail} from "@/types/student.types";
import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {RedirectType, redirect} from "next/navigation";
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
        await fetchNoCache("/student/event/register", "POST", result.data);
        revalidatePath("/event");
        redirect("/event", RedirectType.push);
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
    const data = await fetchNoCache<Comment[]>(
        `/student/event/comments`,
        "POST",
        dto
    );
    return data;
}

export async function getEventDetailById(id: number) {
    const response = await fetchNoCache<EventDetail>(`/student/event/${id}`);
    return response;
}

export async function deleteEventDetailById(
    code: string,
    id: number
): Promise<EventDetail[] | undefined> {
    const res = await fetchNoCache<EventDetail[]>(
        `/student/${code}/event/${id}`,
        "DELETE"
    );
    return res;
}

export async function editComment(id: number, content: string) {
    const result = await fetchNoCache<{data?: unknown}>(
        "/student/event/comments/p",
        "POST",
        {
            id,
            content,
        }
    );
    revalidatePath("/event");
    return result;
}

export async function getVerifiedToken() {
    const token = cookies().get("token")?.value;
    if (token && (await verifyJwtToken(token))) {
        return await verifyJwtToken(token);
    }
    return undefined;
}
