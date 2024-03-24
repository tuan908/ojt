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
        eventName: z.string(),
        eventsInSchoolLife: z.string().optional(),
        myAction: z.string().optional(),
        shownPower: z.string().optional(),
        strengthGrown: z.string().optional(),
        myThought: z.string().optional(),
    }),
});

export type RegisterEventDto = z.infer<typeof registerEventSchema>;

export async function registerEvent(dto: RegisterEventDto) {
    const result = await registerEventSchema.safeParseAsync(dto);

    if (!result.success) {
        console.log(result.error.errors);
    } else {
        // TODO: use postgres's insert here
        // await Astra.insertOne(CollectionName.StudentEventDetail, result.data);
        revalidatePath("/event");
        redirect("/event", RedirectType.push);
    }
}

const commentSchema = z.object({
    username: z.string(),
    content: z.string(),
});

export type AddCommentDto = z.infer<typeof commentSchema>;

export type CommentDto = AddCommentDto & {
    id: number;
    createdAt: string;
    isDeleted: boolean;
};

export async function addComment(dto: AddCommentDto) {}

export async function getEventById(id: number): Promise<EventDetailDto | null> {
    const response = await fetchNoCache(
        `${process.env["SPRING_API"]}/student/event/${id}`
    );
    const result = await response.json();
    return result;
}

export async function getEventDetailList(): Promise<EventDto[] | null> {
    const response = await fetchNoCache(
        `${process.env["SPRING_API"]}/event-detail`
    );
    const result = await response.json();
    return result;
}
