import { CommentSchema } from "@/features/student/validations";
import { z } from "zod";

export type AddCommentPayload = z.infer<typeof CommentSchema>;

export type TComment = Omit<AddCommentPayload, "id"> & {
    id: number;
    name: string;
    roleName: string;
    createdAt: string;
    isDeleted: boolean;
};
