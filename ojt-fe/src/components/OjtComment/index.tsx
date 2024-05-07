import {type CommentDto} from "@/app/actions/event";
import OjtButtonBase from "@/components/ButtonBase";
import {cn} from "@/lib/utils";
import Check from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import {useEffect, useRef, useState, type MouseEventHandler} from "react";

interface BubbleMessageProps {
    message: CommentDto;
    isCommentOfActiveUser: boolean;
}

export default function OjtBubbleMessage(props: BubbleMessageProps) {
    const {message, isCommentOfActiveUser} = props;
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [commentData, setCommentData] = useState(message);
    const [show, setShow] = useState(false);
    const [editable, setEditable] = useState(false);

    const handleOnMouseEnter = () => setShow(true);

    const handleOnMouseLeave = () => setShow(false);

    const acceptEdit = () => {
        setShow(false);
        setEditable(false);
    };

    const handleEdit: MouseEventHandler<HTMLButtonElement> = event => {
        event?.preventDefault();
        setEditable(true);
    };

    useEffect(() => {
        if (textAreaRef.current) {
            const element = textAreaRef.current;
            element.focus();
            element.select();
        }
    }, [editable]);

    const handleDelete = (id: number) => {};

    return (
        <>
            <div
                className={cn(
                    "w-full h-full flex items-center gap-x-6",
                    !isCommentOfActiveUser && "flex-row-reverse"
                )}
            >
                <div className="flex flex-col gap-y-2 items-center w-24">
                    <Avatar sx={{width: 56, height: 56, bgcolor: "#d87579"}} />
                    <span className="bg-[#00c853] text-white font-medium rounded-xl text-center leading-none px-2 py-[0.125rem]">
                        {message?.roleName}
                    </span>
                </div>
                <div className="w-1/2 h-full relative">
                    <div
                        className=" bg-[#fcf8ed] flex flex-col px-4 py-2 rounded-lg hover:cursor-pointer border"
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    >
                        <span className="font-semibold text-[#058af4]">
                            {message.username}
                        </span>

                        {editable ? (
                            <div className="h-full py-2">
                                <textarea
                                    className={cn(
                                        "w-full border-none outline-none bg-transparent resize-none",
                                        editable &&
                                            "bg-white focus:outline-blue-500 rounded-sm px-2 py-1"
                                    )}
                                    disabled={!editable}
                                    value={commentData.content}
                                    onChange={e =>
                                        setCommentData({
                                            ...commentData,
                                            content: e.target.value,
                                        })
                                    }
                                    ref={textAreaRef}
                                />
                            </div>
                        ) : (
                            <span className="py-2">{message.content}</span>
                        )}

                        <span className="text-[12px]">{message.createdAt}</span>
                        <div
                            style={{
                                display:
                                    isCommentOfActiveUser && show && !editable
                                        ? "block"
                                        : "none",
                            }}
                            className={cn(
                                "absolute top-1",
                                !isCommentOfActiveUser ? "left-2" : "right-2",
                                "bg-transparent flex"
                            )}
                        >
                            <OjtButtonBase classes="px-1" onClick={handleEdit}>
                                <Edit className="text-icon-default" />
                            </OjtButtonBase>
                            <OjtButtonBase
                                onClick={() => handleDelete(message.id)}
                            >
                                <Delete color="error" />
                            </OjtButtonBase>
                        </div>
                        {editable ? (
                            <div
                                className={cn(
                                    "absolute bottom-3",
                                    !isCommentOfActiveUser
                                        ? "left-3"
                                        : "right-3",
                                    "bg-transparent flex"
                                )}
                            >
                                <OjtButtonBase
                                    classes="pr-2"
                                    onClick={() => setEditable(false)}
                                >
                                    <Clear color="error" />
                                </OjtButtonBase>
                                <OjtButtonBase onClick={acceptEdit}>
                                    <Check color="success" />
                                </OjtButtonBase>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
