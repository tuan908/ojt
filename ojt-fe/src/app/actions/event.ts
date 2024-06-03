"use server";

import Utils from "@/utils";
import AuthService from "@/services/auth.service";
import {type EventDetail} from "@/types/student.types";
import {revalidatePath, unstable_cache} from "next/cache";
import {cookies} from "next/headers";
import {RedirectType, redirect} from "next/navigation";
import {z} from "zod";
import {KeyPart} from "@/constants";

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
        await Utils.RestTemplate.post("/student/event/register", result.data);
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
    const data = await Utils.RestTemplate.post<Comment[]>(
        `/student/event/comments`,
        dto
    );
    revalidatePath("/event");
    return data;
}

export const getEventDetailById = unstable_cache(
    async (id: number) => {
        const response = await Utils.RestTemplate.get<EventDetail>(
            `/student/event/${id}`
        );
        return response;
    },
    [KeyPart.Student.EventDetail]
);

export async function deleteEventDetailById(
    code: string,
    id: number
): Promise<EventDetail[] | undefined> {
    const res = await Utils.RestTemplate.delete<EventDetail[]>(
        `/student/${code}/event/${id}`
    );
    return res;
}

export async function editComment(id: number, content: string) {
    const requestBody = {
        id,
        content,
    };
    const result = await Utils.RestTemplate.post<{data?: unknown}>(
        "/student/event/comments/p",
        requestBody
    );
    revalidatePath("/event");
    return result;
}

export async function getValidToken() {
    const token = cookies().get("token")?.value;
    if (!token || !(await AuthService.verify(token))) {
        return undefined;
    }

    return await AuthService.verify(token);
}
