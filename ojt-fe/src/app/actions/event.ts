"use server";

import {type ErrorResponseDto} from "@/types";
import {type StudentResponseDto} from "@/types/student.types";
import {revalidatePath} from "next/cache";
import {RedirectType, redirect} from "next/navigation";
import {z} from "zod";

const registerEventSchema = z.object({
    eventName: z.string(),
    eventsInSchoolLife: z.string(),
    myAction: z.string(),
    shownPower: z.string(),
    strengthGrown: z.string(),
    myThought: z.string(),
});

export type RegisterEventDto = z.infer<typeof registerEventSchema>;

export async function registerEvent(dto: RegisterEventDto) {
    const result = await registerEventSchema.safeParseAsync(dto);

    if (!result.success) {
        console.log(result.error.errors);
    } else {
        // TODO: use postgres's insert here
        // await Astra.insertOne(CollectionName.StudentEventDetail, result.data);
        revalidatePath("/event/register");
        redirect("/event/register", RedirectType.push);
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
