import {commentSchema, registerEventSchema} from "@/lib/zod";
import {z} from "zod";

export type AddCommentPayload = z.infer<typeof commentSchema>;

export type Comment = Omit<AddCommentPayload, "id"> & {
    id: number;
    name: string;
    roleName: string;
    createdAt: string;
    isDeleted: boolean;
};

/**
 * RegisterEventDto
 */
export type RegisterEvent = z.infer<typeof registerEventSchema>;
