"use server";

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
    commentContent: z.string(),
    createdDate: z.date(),
    updatedDate: z.date(),
});

export type CommentDto = z.infer<typeof commentSchema>;

export async function addComment(dto: CommentDto) {}
