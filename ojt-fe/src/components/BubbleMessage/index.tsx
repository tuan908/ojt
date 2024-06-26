import {type Comment} from "@/app/actions/event.action";
import {deleteComment} from "@/app/actions/student.action";
import Button from "@/components/Button";
import {cn} from "@/utils";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import {type RefObject, useState} from "react";

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
    setEditState: (value: {id: number; isEditing: boolean}) => void;
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
    const [show, setShow] = useState(false);

    const handleOnMouseEnter = () => {
        if (
            editState.id !== -1 &&
            editState.id === comment.id &&
            editState.isEditing
        ) {
            setShow(false);
        } else {
            setShow(true);
        }
    };

    const handleOnMouseLeave = () => setShow(false);

    const handleDelete = async () => {
        await deleteComment({
            id: comment.id,
            eventDetailId: comment.eventDetailId,
            username: comment.username,
        });

        setComments(comments.filter(x => x.id !== comment.id));
    };

    const enableEdit = () => {
        setEditState({
            id: comment.id,
            isEditing: true,
        });
        setComment({
            id: comment.id,
            content: comment.content,
            eventDetailId: comment.eventDetailId,
            username: comment.username,
        });
        inputRef?.current?.focus();
    };

    return (
        <>
            <div
                className={cn(
                    "w-full h-full flex items-center gap-x-6",
                    isCommentOfActiveUser && "flex-row-reverse"
                )}
            >
                <div className="flex flex-col gap-y-2 items-center w-24">
                    <Avatar sx={{width: 56, height: 56, bgcolor: "#d87579"}} />
                    <span className="bg-[#00c853] text-white font-medium rounded-xl text-center leading-none px-2 py-1 flex items-center">
                        <p>{comment?.roleName}</p>
                    </span>
                </div>
                <div className="w-1/2 h-full relative">
                    <div
                        className=" bg-[#fcf8ed] flex flex-col px-4 py-2 rounded-lg hover:cursor-pointer border"
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    >
                        <span className="font-semibold text-[#058af4]">
                            {comment?.name}
                        </span>
                        <span className="py-2">{comment?.content}</span>
                        <span className="text-[12px]">
                            {comment?.createdAt}
                        </span>
                        {isCommentOfActiveUser && show ? (
                            <div
                                className={cn(
                                    "absolute top-1",
                                    !isCommentOfActiveUser
                                        ? "left-2"
                                        : "right-2",
                                    "bg-transparent flex"
                                )}
                            >
                                <Button classes="px-1" onClick={enableEdit}>
                                    <Edit className="text-icon-default" />
                                </Button>
                                <Button onClick={handleDelete}>
                                    <Delete color="error" />
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
