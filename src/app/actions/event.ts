"use server";

import {Collection} from "@/constants";
import db from "@/lib/db";
import {z} from "zod";

const schema = z.object({
    eventName: z.string(),
    eventsInSchoolLife: z.string(),
    myAction: z.string(),
    shownPower: z.string(),
    strengthGrown: z.string(),
    myThought: z.string(),
});

export type RegisterStudentEventDto = z.infer<typeof schema>;

export async function registerEvent(dto: RegisterStudentEventDto) {
    const result = await schema.safeParseAsync(dto);

    if (!result.success) {
        console.log(result.error.errors);
    } else {
        console.log(result.data);
        const collection = await db.collection(Collection.EventDetail);
        const response = await collection.insertOne(result.data);
        console.log(response);
        return {
            message: "",
        };
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
