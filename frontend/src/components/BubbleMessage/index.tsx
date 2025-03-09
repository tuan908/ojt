import { deleteComment } from "@/app/actions/student";
import json from "@/i18n/jp.json";
import { cn, convertRole } from "@/lib/utils";
import { type Comment } from "@/types/event";
import { Edit } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { type RefObject, useCallback, useState } from "react";

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
    setEditState,
    setComment,
    comments,
    setComments,
    inputRef,
}: BubbleMessageProps) {
    // Compute `show` dynamically instead of using state
    const [showActions, setShow] = useState(false);

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

    const handleMouseEnter = () => setShow(true);

    const handleMouseLeave = () => setShow(false);

    return (
        <div
            className={cn(
                "w-full flex items-center gap-x-6",
                isCommentOfActiveUser && "flex-row-reverse"
            )}
        >
            <div className="w-28">
                <div className="w-full hidden md:flex flex-col gap-y-2 items-center ">
                    <Avatar
                        sx={{ width: 56, height: 56, bgcolor: "#d87579" }}
                    />
                    <span className="bg-[#00c853] text-white font-medium rounded-xl text-center px-2 py-1">
                        {convertRole(comment.roleName)}
                    </span>
                </div>
            </div>
            <div className="w-full md:w-1/2 relative">
                <div
                    className="bg-[#fcf8ed] flex flex-col px-4 py-2 rounded-lg hover:cursor-pointer border"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <span className="font-semibold text-[#058af4]">
                        {comment.name}
                    </span>
                    <span className="py-2">{comment.content}</span>
                    <span className="text-[12px]">{comment.createdAt}</span>

                    {showActions && (
                        <div className="absolute top-1 right-1 flex items-center gap-x-3 bg-white rounded-md px-2 py-1">
                            <Tooltip title={json.common.edit}>
                                <button
                                    onClick={enableEdit}
                                    className="cursor-pointer"
                                >
                                    <Edit className="text-icon-default" />
                                </button>
                            </Tooltip>

                            <Tooltip title={json.common.delete}>
                                <button
                                    onClick={handleDelete}
                                    className="cursor-pointer"
                                >
                                    <Delete color="error" />
                                </button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
