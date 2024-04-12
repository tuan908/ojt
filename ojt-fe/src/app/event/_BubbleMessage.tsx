import ButtonBase from "@/components/ButtonBase";
import CustomDialog from "@/components/CustomDialog";
import { type MyJwtPayload } from "@/lib/auth";
import { cn } from "@/lib/utils/cn";
import Check from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
    type SyntheticEvent,
} from "react";
import { CommentDto } from "../actions/event";

interface BubbleMessageProps {
    data: CommentDto;
    showState: Array<{index: number; isShow: boolean}>;
    setShow: Dispatch<
        SetStateAction<
            {
                isShow: boolean;
                index: number;
            }[]
        >
    >;
    auth: MyJwtPayload | null;
    handleDelete: () => void;
    openDialog: {
        delete: boolean;
        discard: boolean;
    };
    setOpenDialog: Dispatch<SetStateAction<{
        delete: boolean;
        discard: boolean;
    }>>
}

export default function BubbleMessage({
    data,
    showState,
    setShow,
    auth,
    handleDelete,
    openDialog,
    setOpenDialog
}: BubbleMessageProps) {
    const router = useRouter();
    const inputCommentRef = useRef<HTMLTextAreaElement>(null);
    const isUser = auth?.username! !== data?.username!;
    const [editable, setEditable] = useState(false);
    const [commentData, setCommentData] = useState(data);


    const handleOnMouseEnter = (
        e: SyntheticEvent<HTMLDivElement, Event>,
        index: number
    ) => {
        e.preventDefault();
        let ele = showState?.find(x => x.index === index);
        if (ele) {
            setShow(x => {
                // Set others comment isShow to false
                let array = x
                    .filter(comment => comment.index !== index)
                    .map(x => ({...x, isShow: false}));
                // Set target comment isShow to true
                array.push({index, isShow: true});
                return array;
            });
        }
    };

    const handleOnMouseLeave = (
        e: SyntheticEvent<HTMLDivElement, Event>,
        index: number
    ) => {
        e.preventDefault();
        let ele = showState?.find(x => x.index === index);
        if (ele) {
            setShow(x => {
                let array = x.filter(comment => comment.index !== index);
                array.push({index, isShow: false});
                return array;
            });
        }
    };

    const openDiscardDialog = () => {
        setOpenDialog({...openDialog, discard: true});
    };

    const acceptEdit = () => {
        const el = showState.find(s => s.index === data.id);
        if (el && el.isShow) {
            el.isShow = false;
        }
        setEditable(false);
    };

    const handleEdit = () => {
        setEditable(true);
    };



    const cancelDiscard = () => {
        const el = showState.find(s => s.index === data.id);
        if (el && el.isShow) {
            el.isShow = false;
        }
        setOpenDialog({...openDialog, discard: false});
    };

    const acceptDiscard = () => {
        setCommentData(data);
        setEditable(false);
        const el = showState.find(s => s.index === data.id);
        if (el && el.isShow) {
            el.isShow = false;
        }
        setOpenDialog({...openDialog, discard: false});
    };

    useEffect(() => {
        if (inputCommentRef.current) {
            const element = inputCommentRef.current;
            element.focus();
            element.setSelectionRange(
                element.value.length,
                element.value.length
            );
        }
    }, [editable]);

    const handleCancelDelete = () =>
        setOpenDialog({...openDialog, delete: false});

    const openDeleteDialog = () =>
        setOpenDialog({
            ...openDialog,
            delete: true,
        });

    const handleCloseDeleteDialog = () =>
        setOpenDialog({...openDialog, delete: false});

    return (
        <>
            <div
                className={cn(
                    "w-full h-full flex items-center gap-x-6",
                    isUser && "flex-row-reverse"
                )}
            >
                <div className="flex flex-col gap-y-2 items-center">
                    <Avatar sx={{width: 56, height: 56, bgcolor: "#d87579"}} />
                    <span className="bg-[#00c853] text-white font-medium rounded-xl text-center leading-none px-2 py-[0.125rem]">
                        {data?.roleName}
                    </span>
                </div>
                <div className="w-1/2 h-full relative">
                    <div
                        className=" bg-[#fcf8ed] flex flex-col px-4 py-2 rounded-lg hover:cursor-pointer border"
                        onMouseEnter={e => handleOnMouseEnter(e, data.id)}
                        onMouseLeave={e => handleOnMouseLeave(e, data.id)}
                    >
                        <span className="font-semibold text-[#058af4]">
                            {data.username}
                        </span>

                        {editable ? (
                            <div className="h-full py-2">
                                <textarea
                                    className={cn(
                                        "w-full border-none outline-none bg-transparent resize-none",
                                        editable &&
                                            "bg-white focus:outline-blue-500 rounded-sm"
                                    )}
                                    disabled={!editable}
                                    value={commentData.content}
                                    onChange={e =>
                                        setCommentData({
                                            ...commentData,
                                            content: e.target.value,
                                        })
                                    }
                                    ref={inputCommentRef}
                                />
                            </div>
                        ) : (
                            <span className="py-2">{data.content}</span>
                        )}

                        <span className="text-[12px]">{data.createdAt}</span>
                        <div
                            style={{
                                display:
                                    auth?.username! === data?.username! &&
                                    showState.find(s => s.index === data.id)!
                                        ?.isShow &&
                                    !editable
                                        ? "block"
                                        : "none",
                            }}
                            className={cn(
                                "absolute top-1",
                                isUser ? "left-2" : "right-2",
                                "bg-transparent flex"
                            )}
                        >
                            <ButtonBase classes="px-1" onClick={handleEdit}>
                                <Edit className="text-icon-default" />
                            </ButtonBase>
                            <ButtonBase onClick={openDeleteDialog}>
                                <Delete color="error" />
                            </ButtonBase>
                        </div>
                        {editable ? (
                            <div
                                className={cn(
                                    "absolute bottom-3",
                                    isUser ? "left-3" : "right-3",
                                    "bg-transparent flex"
                                )}
                            >
                                <ButtonBase
                                    classes="pr-2"
                                    onClick={openDiscardDialog}
                                >
                                    <Clear color="error" />
                                </ButtonBase>
                                <ButtonBase>
                                    <Check
                                        color="success"
                                        onClick={acceptEdit}
                                    />
                                </ButtonBase>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <Dialog
                open={openDialog.discard}
                onClose={() => setOpenDialog({...openDialog, discard: false})}
            >
                <DialogTitle>Do you want to discard this draft?</DialogTitle>
                <DialogActions>
                    <ButtonBase
                        classes="px-4 py-2 border"
                        onClick={cancelDiscard}
                    >
                        Cancel
                    </ButtonBase>
                    <ButtonBase
                        classes="px-4 py-1 border bg-blue-400 rounded-md text-white"
                        onClick={acceptDiscard}
                    >
                        Discard
                    </ButtonBase>
                </DialogActions>
            </Dialog>

            <CustomDialog
                open={openDialog.delete}
                onClose={handleCloseDeleteDialog}
                title="Do you want to delete this comment?"
                actionName="Delete"
                onCancelClick={handleCancelDelete}
                onActionClick={handleDelete}
                bg={"bg-red-400"}
            />
        </>
    );
}
