"use server";

import {verifyJwtToken} from "@/lib/auth";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import {ErrorResponseDto, OjtStatusCode} from "@/types";
import {type EventDto} from "@/types/event.types";
import {type EventDetailDto} from "@/types/student.types";
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
export type RegisterEventDto = z.infer<typeof registerEventSchema>;

/**
 * Register Event
 * @param dto Register Event Dto
 */
export async function registerEvent(dto: RegisterEventDto) {
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

export type AddCommentDto = z.infer<typeof commentSchema>;

export type CommentDto = AddCommentDto & {
    id: number;
    name: string;
    roleName: string;
    createdAt: string;
    isDeleted: boolean;
};

export async function addComment(dto: AddCommentDto) {
    const data = await fetchNoCache<CommentDto[]>(
        `/student/event/comments`,
        "POST",
        dto
    );
    return data;
}

export async function getEventDetailById(id: number) {
    const response = await fetchNoCache<EventDetailDto>(`/student/event/${id}`);
    return response;
}

export async function deleteEventDetailById(
    code: string,
    id: number
): Promise<EventDetailDto[] | undefined> {
    const res = await fetchNoCache<EventDetailDto[]>(
        `/student/${code}/event/${id}`,
        "DELETE"
    );
    return res;
}

export async function getEventDetails() {
    const response = await fetchNoCache<EventDto[]>(`/event-detail`);
    return response;
}

export async function editComment(
    id: number,
    content: string
): Promise<{data: unknown} | ErrorResponseDto> {
    try {
        const result = await fetchNoCache<{data: unknown} | ErrorResponseDto>(
            "/student/event/comments/p",
            "POST",
            {
                id,
                content,
            }
        );
        revalidatePath("/event");
        return result;
    } catch (error) {
        return {
            message: "Internal Server Error",
            type: "InternalServerError",
            code: OjtStatusCode.InternalServerError,
        };
    }
}

export async function getVerifiedToken() {
    const token = cookies().get("token")?.value;
    if (token && (await verifyJwtToken(token))) {
        return await verifyJwtToken(token);
    }
    return undefined;
}
