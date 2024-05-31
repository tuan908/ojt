import {type Comment} from "@/app/actions/event";
import {deleteComment} from "@/app/actions/student";
import Button from "@/components/Button";
import Utils from "@/utils";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import {startTransition, useState} from "react";

interface BubbleMessageProps {
    comment: Comment;
    isCommentOfActiveUser: boolean;
    editState: {
        id: number;
        isEditing: boolean;
    };
    setEditState: (value: {id: number; isEditing: boolean}) => void;
    setComment: (
        data: Pick<Comment, "id" | "content" | "eventDetailId" | "username">
    ) => void;
    comments: Comment[];
    setComments: (comments: Comment[]) => void;
}

export default function BubbleMessage(props: BubbleMessageProps) {
    const {comment, isCommentOfActiveUser} = props;
    const [show, setShow] = useState(false);

    const handleOnMouseEnter = () => {
        if (
            props.editState.id !== -1 &&
            props.editState.id === comment.id &&
            props.editState.isEditing
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
        startTransition(() => {
            props.setComments(props.comments.filter(x => x.id !== comment.id));
        });
    };

    const enableEdit = () => {
        props.setEditState({
            id: comment.id,
            isEditing: true,
        });
        props.setComment({
            id: comment.id,
            content: comment.content,
            eventDetailId: comment.eventDetailId,
            username: comment.username,
        });
    };

    return (
        <>
            <div
                className={Utils.cn(
                    "w-full h-full flex items-center gap-x-6",
                    isCommentOfActiveUser && "flex-row-reverse"
                )}
            >
                <div className="flex flex-col gap-y-2 items-center w-24">
                    <Avatar sx={{width: 56, height: 56, bgcolor: "#d87579"}} />
                    <span className="bg-[#00c853] text-white font-medium rounded-xl text-center leading-none px-2 py-[0.125rem]">
                        {comment?.roleName}
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
                                className={Utils.cn(
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
