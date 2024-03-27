"use client";

import {
    CommentDto,
    addComment,
    getEventDetailList,
    registerEvent,
    type AddCommentDto,
    type RegisterEventDto,
} from "@/app/actions/event";
import {ITEM_HEIGHT, ITEM_PADDING_TOP, UserRole} from "@/constants";

import {getEventDetailById} from "@/app/actions/event";
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
import {useRouter, useSearchParams} from "next/navigation";
import {
    Fragment,
    Suspense,
    useEffect,
    useState,
    type ComponentProps,
    type SyntheticEvent,
} from "react";
import {getHashtagList} from "../actions/tracking";
import BubbleMessage from "./_BubbleMessage";
import "./register.css";

export default function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useAppSelector(getLoadingState);
    const {auth} = useAuth();
    const params = useSearchParams();
    const [registerData, setData] = useState<RegisterEventDto["data"]>({});

    const [eventOptions, setEventOptions] = useState<EventDto[]>([]);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [showState, setShow] = useState<
        Array<{isShow: boolean; index: number}>
    >([]);
    const [isDisable, setDisable] = useState(false);
    const [hashtagList, setHashtagList] = useState<HashtagDto[]>([]);

    async function init() {
        await dispatch(showLoading());
        let id = parseInt(params.get("id") ?? "");
        const promises = await Promise.allSettled([
            getEventDetailById(id),
            getEventDetailList(),
            getHashtagList(),
        ]);

        if (promises[0].status === "fulfilled") {
            const detail = promises[0].value;

            if (detail !== null) {
                setData({
                    eventName: detail.name,
                    eventsInSchoolLife: detail.data?.eventsInSchoolLife,
                    myAction: detail?.data?.myAction,
                    myThought: detail?.data?.myThought,
                    shownPower: detail?.data?.shownPower,
                    strengthGrown: detail?.data?.strengthGrown,
                });
                setComments(detail?.comments);
                setShow(
                    detail?.comments?.map(x => ({
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
        if (params.get("mode") === "chat") {
            setDisable(true);
        }
    }, []);

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

    async function handleUpdateEventDetail(
        e: SyntheticEvent<HTMLButtonElement>
    ) {
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
            await dispatch(showLoading());
            let data: AddCommentDto = {
                ...commentData,
                eventDetailId: Number(params.get("id")),
                username: auth.username,
            };
            await addComment(data)
                .then(async res => {
                    if (res) {
                        setComments(res);
                        setCommentData({...commentData, content: ""});
                        setShow(res.map(x => ({index: x.id, isShow: false})));
                    }
                })
                .finally(async () => {
                    await dispatch(hideLoading());
                });
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
                            className="w-full border-default disabled:cursor-not-allowed"
                            placeholder="Select Event"
                            value={registerData.eventName ?? "Event"}
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
                            disabled={isDisable}
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
                        className="resize-none border rounded-md px-4 py-2 outline-blue-500 disabled:cursor-not-allowed"
                        name="eventsInSchoolLife"
                        placeholder="Events in school life"
                        onChange={handleChange}
                        value={registerData.eventsInSchoolLife}
                        disabled={isDisable}
                    />

                    {/* My Actions */}
                    <Textarea
                        className="disabled:cursor-not-allowed"
                        name="myAction"
                        placeholder="My Actions"
                        onChange={handleChange}
                        value={registerData.myAction}
                        disabled={isDisable}
                    />

                    {/* Shown power */}
                    <textarea
                        className="resize-none border rounded-md px-4 py-2 outline-blue-500 disabled:cursor-not-allowed"
                        name="shownPower"
                        placeholder="Shown power"
                        onChange={handleChange}
                        value={registerData.shownPower}
                        disabled={isDisable}
                    />

                    {/* Strength that has grown */}
                    <Textarea
                        name="strengthGrown"
                        placeholder="Strength that has grown"
                        onChange={handleChange}
                        value={registerData.strengthGrown}
                        disabled={isDisable}
                        className="disabled:cursor-not-allowed"
                    />

                    {/* What I thought */}
                    <Textarea
                        name="myThought"
                        placeholder="What I thought"
                        onChange={handleChange}
                        value={registerData.myThought}
                        disabled={isDisable}
                        className="disabled:cursor-not-allowed"
                    />

                    <button
                        className="border-none px-4 py-2 text-white rounded-md m-auto hover:cursor-pointer disabled:cursor-not-allowed"
                        style={{backgroundColor: "#4285f4"}}
                        onClick={async e => handleUpdateEventDetail(e)}
                        disabled={isDisable}
                    >
                        Add
                    </button>
                </div>
            </div>

            {params.get("mode") && params.get("mode") !== "new" ? (
                <>
                    <Suspense fallback={<>Loading comments...</>}>
                        <div className="w-1/2 h-full m-auto flex flex-col gap-y-8 relative">
                            {comments?.map((x, index) => {
                                return (
                                    <Fragment key={x.id}>
                                        {x.isDeleted ? (
                                            <span className="text-red-500">
                                                Deleted
                                            </span>
                                        ) : (
                                            <BubbleMessage
                                                data={x}
                                                showState={showState}
                                                setShow={setShow}
                                                auth={auth}
                                            />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>
                        <div className="w-3/5 m-auto flex items-center gap-x-8">
                            <Avatar sx={{width: 72, height: 72}} />
                            <div className="w-full flex items-center relative">
                                {auth?.role === UserRole.Counselor ? (
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
                                ) : (
                                    <TextField
                                        sx={{
                                            width: "100%",
                                            flexWrap: "nowrap",
                                            bgcolor: "#ffffff",
                                        }}
                                        onChange={event =>
                                            setCommentData({
                                                ...commentData,
                                                content: event.target.value,
                                            })
                                        }
                                        value={commentData.content}
                                        placeholder="Input comment here..."
                                        multiline
                                        variant="outlined"
                                        rows={2}
                                    />
                                )}

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
                                className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
                                onClick={handleAddComment}
                                disabled={commentData.content.length === 0}
                            >
                                <Send
                                    className="-rotate-[50deg] text-icon-default"
                                    sx={{width: 32, height: 32}}
                                />
                            </button>
                        </div>
                    </Suspense>
                </>
            ) : null}
        </div>
    );
}
