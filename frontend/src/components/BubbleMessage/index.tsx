import { deleteComment } from "@/app/actions/student.action";
import Button from "@/components/Button";
import { type Comment } from "@/types/event-action.types";
import { cn } from "@/utils";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import { type RefObject, useCallback } from "react";

type CommentPayload = Pick<
    Comment,
    "id" | "content" | "eventDetailId" | "username"
>;

interface BubbleMessageProps {
    comment: Comment;
    isCommentOfActiveUser: boolean;
    editState: {
        id: number;
        isEditing: boolean;
    };
    setEditState: (value: { id: number; isEditing: boolean }) => void;
    setComment: (data: CommentPayload) => void;
    comments: Comment[];
    setComments: (comments: Comment[]) => void;
    inputRef: RefObject<HTMLInputElement>;
}

export default function BubbleMessage({
    comment,
    isCommentOfActiveUser,
    editState,
    setEditState,
    setComment,
    comments,
    setComments,
    inputRef,
}: BubbleMessageProps) {
    // Compute `show` dynamically instead of using state
    const showActions = isCommentOfActiveUser && editState.id !== comment.id;

    const handleDelete = useCallback(async () => {
        await deleteComment({
            id: comment.id,
            eventDetailId: comment.eventDetailId,
            username: comment.username,
        });

        setComments(comments.filter(x => x.id !== comment.id));
    }, [comment, comments, setComments]);

    const enableEdit = useCallback(() => {
        setEditState({ id: comment.id, isEditing: true });
        setComment({
            id: comment.id,
            content: comment.content,
            eventDetailId: comment.eventDetailId,
            username: comment.username,
        });
        inputRef?.current?.focus();
    }, [comment, setEditState, setComment, inputRef]);

    return (
        <div className={cn("w-full flex items-center gap-x-6", isCommentOfActiveUser && "flex-row-reverse")}>
            <div className="hidden md:flex flex-col gap-y-2 items-center w-24">
                <Avatar sx={{ width: 56, height: 56, bgcolor: "#d87579" }} />
                <span className="bg-[#00c853] text-white font-medium rounded-xl text-center px-2 py-1">
                    {comment.roleName}
                </span>
            </div>
            <div className="w-full md:w-1/2 relative">
                <div
                    className="bg-[#fcf8ed] flex flex-col px-4 py-2 rounded-lg hover:cursor-pointer border"
                >
                    <span className="font-semibold text-[#058af4]">{comment.name}</span>
                    <span className="py-2">{comment.content}</span>
                    <span className="text-[12px]">{comment.createdAt}</span>

                    {showActions && (
                        <div className="absolute top-1 right-2 bg-transparent flex">
                            <Button classes="px-1" onClick={enableEdit}>
                                <Edit className="text-icon-default" />
                            </Button>
                            <Button onClick={handleDelete}>
                                <Delete color="error" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}