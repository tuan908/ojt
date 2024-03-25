"use client";

import {
    CommentDto,
    addComment,
    getEventDetailList,
    registerEvent,
    type AddCommentDto,
    type RegisterEventDto,
} from "@/app/actions/event";
import {ITEM_HEIGHT, ITEM_PADDING_TOP} from "@/constants";

import {getEventById} from "@/app/actions/event";
import ButtonBase from "@/components/ButtonBase";
import LoadingComponent from "@/components/LoadingComponent";
import Textarea from "@/components/Textarea";
import {useAuth} from "@/lib/hooks/useAuth";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import {
    getLoadingState,
    hideLoading,
    showLoading,
} from "@/lib/redux/slice/loadingSlice";
import {type EventDto} from "@/types/event.types";
import {type HashtagDto} from "@/types/student.types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Send from "@mui/icons-material/Send";
import SentimentSatisfiedAlt from "@mui/icons-material/SentimentSatisfiedAlt";
import Autocomplete, {
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Select, {type SelectProps} from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {useSearchParams} from "next/navigation";
import {
    useEffect,
    useState,
    type ComponentProps,
    type SyntheticEvent,
} from "react";
import {getHashtagList} from "../actions/tracking";
import "./register.css";

export default function Page() {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(getLoadingState);
    const {auth} = useAuth();
    const params = useSearchParams();
    const [registerData, setData] = useState<RegisterEventDto["data"]>({
        eventName: "",
        eventsInSchoolLife: "",
        myAction: "",
        myThought: "",
        shownPower: "",
        strengthGrown: "",
    });

    const [eventOptions, setEventOptions] = useState<EventDto[]>([]);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [showState, setShow] = useState<
        Array<{isShow: boolean; index: number}>
    >([]);
    const [hashtagList, setHashtagList] = useState<HashtagDto[]>([]);

    async function init() {
        await dispatch(showLoading());
        let id = parseInt(params.get("id") ?? "");
        const promises = await Promise.allSettled([
            getEventById(id),
            getEventDetailList(),
            getHashtagList(),
        ]);

        if (promises[0].status === "fulfilled") {
            const eventDetail = promises[0].value;

            if (eventDetail !== null) {
                if (eventDetail.data !== null) {
                    setData({
                        eventName: eventDetail.name,
                        eventsInSchoolLife: eventDetail.data.eventsInSchoolLife,
                        myAction: eventDetail.data.myAction,
                        myThought: eventDetail.data.myThought,
                        shownPower: eventDetail.data.shownPower,
                        strengthGrown: eventDetail.data.strengthGrown,
                    });
                }
                setComments(eventDetail.comments);
                setShow(
                    eventDetail.comments.map(x => ({
                        index: x.id,
                        isShow: false,
                    }))
                );
            }
        }

        if (promises[1].status === "fulfilled") {
            const events = promises[1].value;
            if (events !== null) {
                setEventOptions(events);
            }
        }

        if (promises[2].status === "fulfilled") {
            const hashtagList = promises[2].value;
            if (hashtagList !== null) {
                setHashtagList(hashtagList);
            }
        }

        await dispatch(hideLoading());
    }

    useEffect(() => {
        init();
    }, []);
    console.log(auth);

    const [openPicker, setOpen] = useState(false);
    const [commentData, setCommentData] = useState<AddCommentDto>({
        eventDetailId: -1,
        username: "",
        content: "",
    });
    const [openSuggest, setOpenSuggest] = useState(false);

    function handleInputCommentChange(
        event: SyntheticEvent,
        _value: string | {label: string; value: string} | null,
        reason: AutocompleteInputChangeReason
    ): void {
        event?.preventDefault();
        if (_value !== null) {
            switch (true) {
                case typeof _value === "string":
                    setCommentData({...commentData, content: _value});
                    if (_value.startsWith("#")) {
                        setOpenSuggest(true);
                    }
                    break;

                case typeof _value === "object":
                    setCommentData({
                        ...commentData,
                        content: _value.value,
                    });
                    break;

                default:
                    throw new Error("Invalid input");
            }
        }

        if (reason === "reset") {
            setOpenSuggest(false);
        }
    }

    function handleChangeComment(
        event: SyntheticEvent<Element, Event>,
        _value: NonNullable<string | {id: number; label: string}>,
        reason: AutocompleteChangeReason
    ): void {
        event?.preventDefault();
        if (typeof _value === "string") {
            setCommentData({
                ...commentData,
                content: commentData.content.concat(_value, " "),
            });
        }

        if (typeof _value === "object") {
            setCommentData({
                ...commentData,
                content: commentData.content.concat(_value.label, " "),
            });
        }

        if (reason === "selectOption" && openSuggest) {
            setOpenSuggest(false);
        }
    }

    const handleSelectChange: SelectProps<string>["onChange"] = e => {
        setData({...registerData, eventName: e.target.value});
    };

    const handleChange: ComponentProps<"textarea">["onChange"] = e => {
        e?.preventDefault();
        setData({
            ...registerData,
            [e?.target.name]: e?.target.value,
        });
    };

    async function handleClick(e: SyntheticEvent<HTMLButtonElement>) {
        e?.preventDefault();
        await registerEvent({
            username: auth?.username!,
            gradeName: auth?.grade!,
            eventDetailId: parseInt(params.get("id")!),
            data: registerData,
        });
    }

    async function handleAddComment(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
    ) {
        event?.preventDefault();
        if (auth && auth.username) {
            let data: AddCommentDto = {
                ...commentData,
                eventDetailId: Number(params.get("id")),
                username: auth.username,
            };
            await addComment(data);
        }
    }

    function handleSelect(emoji: any) {
        if (!emoji?.native) return;
        setCommentData({
            ...commentData,
            content: commentData.content.concat(emoji?.native),
        });
        setOpen(false);
    }

    const handleOnMouseEnter = (
        e: SyntheticEvent<HTMLDivElement, Event>,
        index: number
    ) => {
        e.preventDefault();
        console.log(`Show edit/delete button on comment #${index}`);
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
        console.log(`Hide edit/delete button on comment #${index}`);
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
        <div className="pt-12 w-full flex flex-col gap-y-8">
            {isLoading ? <LoadingComponent /> : null}
            <div className="w-1/2 m-auto bg-white rounded-xl shadow-2xl">
                <div className="w-[90%] m-auto flex flex-col gap-y-6 py-6">
                    {/* Select */}
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="selectEvent">Select Event:</label>
                        <Select
                            variant="outlined"
                            className="w-full border-default"
                            placeholder="Select Event"
                            defaultValue="Event"
                            sx={{bgcolor: "#ffffff", paddingX: 1}}
                            MenuProps={{
                                slotProps: {
                                    paper: {
                                        style: {
                                            maxHeight:
                                                ITEM_HEIGHT * 4.5 +
                                                ITEM_PADDING_TOP,
                                        },
                                    },
                                },
                            }}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="Event">Event</MenuItem>
                            {eventOptions.map(x => (
                                <MenuItem
                                    key={x.id}
                                    value={x.name}
                                    disableRipple
                                    disableTouchRipple
                                >
                                    {x.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    {/* Events in school life */}
                    <Textarea
                        className="resize-none border rounded-md px-4 py-2 outline-blue-500"
                        name="eventsInSchoolLife"
                        placeholder="Events in school life"
                        onChange={handleChange}
                    />

                    {/* My Actions */}
                    <Textarea
                        name="myAction"
                        placeholder="My Actions"
                        onChange={handleChange}
                    />

                    {/* Shown power */}
                    <textarea
                        className="resize-none border rounded-md px-4 py-2 outline-blue-500"
                        name="shownPower"
                        placeholder="Shown power"
                        onChange={handleChange}
                    />

                    {/* Strength that has grown */}
                    <Textarea
                        name="strengthGrown"
                        placeholder="Strength that has grown"
                        onChange={handleChange}
                    />

                    {/* What I thought */}
                    <Textarea
                        name="myThought"
                        placeholder="What I thought"
                        onChange={handleChange}
                    />

                    <button
                        className="border-none px-4 py-2 text-white rounded-md m-auto hover:cursor-pointer"
                        style={{backgroundColor: "#4285f4"}}
                        onClick={async e => handleClick(e)}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="w-1/2 m-auto flex flex-col gap-y-4">
                {comments.map(x => {
                    return (
                        <div
                            key={x.id}
                            className="w-1/2 h-full bg-white flex flex-col px-4 py-2 rounded-lg relative hover:cursor-pointer"
                            onMouseEnter={e => handleOnMouseEnter(e, x.id)}
                            onMouseLeave={e => handleOnMouseLeave(e, x.id)}
                        >
                            <span className="pb-1">{x.content}</span>
                            <span className="text-[12px]">{x.createdAt}</span>
                            <div
                                style={{
                                    display: showState.find(
                                        s => s.index === x.id
                                    )!?.isShow
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
                    );
                })}
            </div>

            <div className="w-3/5 m-auto flex items-center gap-x-8">
                <Avatar sx={{width: 72, height: 72}} />
                <div className="w-full flex items-center relative">
                    <Autocomplete
                        className="w-full"
                        sx={{
                            "& .MuiAutocomplete-inputRoot": {
                                flexWrap: "nowrap",
                                bgcolor: "#ffffff",
                                paddingX: 1,
                            },
                        }}
                        options={hashtagList.map(x => ({
                            label: x.name,
                            id: x.id,
                        }))}
                        renderInput={params => (
                            <TextField
                                {...params}
                                placeholder="Input comment here..."
                                multiline
                                variant="outlined"
                                rows={2}
                            />
                        )}
                        onInputChange={handleInputCommentChange}
                        onChange={handleChangeComment}
                        open={openSuggest}
                        inputValue={commentData.content}
                        disableListWrap
                        disableClearable
                        disablePortal
                        freeSolo
                    />

                    <button
                        onClick={() => setOpen(!openPicker)}
                        className="absolute top-1 right-2"
                    >
                        {!openPicker ? (
                            <SentimentSatisfiedAlt
                                sx={{width: 22, height: 22}}
                            />
                        ) : (
                            <Close sx={{width: 22, height: 22}} />
                        )}
                    </button>
                    {openPicker ? (
                        <Picker
                            data={data}
                            onEmojiSelect={handleSelect}
                            open={openPicker}
                            previewPosition="none"
                            onClickOutside={() => setOpen(false)}
                        />
                    ) : null}
                </div>
                <button
                    className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3"
                    onClick={handleAddComment}
                >
                    <Send
                        className="-rotate-[50deg] text-icon-default"
                        sx={{width: 32, height: 32}}
                    />
                </button>
            </div>
        </div>
    );
}
