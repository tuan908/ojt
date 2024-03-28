"use server";

import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import {EventDto} from "@/types/event.types";
import {EventDetailDto} from "@/types/student.types";
import {revalidatePath} from "next/cache";
import {RedirectType, redirect} from "next/navigation";
import {z} from "zod";

const registerEventSchema = z.object({
    username: z.string(),
    eventDetailId: z.number(),
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
        // TODO: use postgres's insert here
        // await Astra.insertOne(CollectionName.StudentEventDetail, result.data);
        revalidatePath("/event");
        redirect("/event", RedirectType.push);
    }
}

const commentSchema = z.object({
    eventDetailId: z.number(),
    username: z.string(),
    content: z.string(),
});

export type AddCommentDto = z.infer<typeof commentSchema>;

export type CommentDto = AddCommentDto & {
    id: number;
    name: string;
    roleName: string;
    createdAt: string;
    isDeleted: boolean;
};

export async function addComment(
    dto: AddCommentDto
): Promise<CommentDto[] | null> {
    try {
        const res = await fetchNoCache(`/student/event/comments`, "POST", dto);
        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error("Failed to add comment");
    }
}

export async function getEventDetailById(
    id: number
): Promise<EventDetailDto | null> {
    const response = await fetchNoCache(`/student/event/${id}`);
    const result = await response.json();
    return result;
}

export async function getEventDetailList(): Promise<EventDto[] | null> {
    const response = await fetchNoCache(`/event-detail`);
    const result = await response.json();
    return result;
}
