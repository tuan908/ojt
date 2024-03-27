import ButtonBase from "@/components/ButtonBase";
import {MyJwtPayload} from "@/lib/auth";
import {cn} from "@/lib/utils/cn";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import {type Dispatch, type SetStateAction, type SyntheticEvent} from "react";
import {CommentDto} from "../actions/event";

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
}

export default function BubbleMessage({
    data,
    showState,
    setShow,
    auth,
}: BubbleMessageProps) {
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

    return (
        <div
            className={cn(
                "w-full flex items-center gap-x-6 h-24",
                auth?.username! !== data?.username! && "flex-row-reverse"
            )}
        >
            <div className="flex flex-col gap-y-2 items-center">
                <Avatar sx={{width: 56, height: 56, bgcolor: "#d87579"}} />
                <span className="bg-[#00c853] text-white font-medium rounded-xl text-center leading-none px-2 py-[0.125rem]">
                    {data?.roleName}
                </span>
            </div>
            <div
                className="w-1/2 h-full bg-[#fcf8ed] flex flex-col px-4 py-2 rounded-lg relative hover:cursor-pointer border"
                onMouseEnter={e => handleOnMouseEnter(e, data.id)}
                onMouseLeave={e => handleOnMouseLeave(e, data.id)}
            >
                <span className="font-semibold text-[#058af4]">
                    {data.username}
                </span>
                <span className="pb-1">{data.content}</span>
                <span className="text-[12px]">{data.createdAt}</span>
                <div
                    style={{
                        display:
                            auth?.username! === data?.username! &&
                            showState.find(s => s.index === data.id)!?.isShow
                                ? "block"
                                : "none",
                    }}
                    className="absolute left-2 top-1 bg-white flex gap-x-2 "
                >
                    <ButtonBase classes="rounded-full shadow-lg border p-[0.125rem]">
                        <Edit className="text-icon-default" />
                    </ButtonBase>
                    <ButtonBase classes="rounded-full shadow-lg border p-[0.125rem]">
                        <Delete color="error" />
                    </ButtonBase>
                </div>
            </div>
        </div>
    );
}
