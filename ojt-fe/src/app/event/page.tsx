"use client";

import {
    addComment,
    getEventDetailList,
    registerEvent,
    type AddCommentDto,
    type CommentDto,
    type RegisterEventDto,
} from "@/app/actions/event";
import {ITEM_HEIGHT, ITEM_PADDING_TOP, ScreenMode, UserRole} from "@/constants";

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
import {getHashtagList} from "../actions/common";
import BubbleMessage from "./_BubbleMessage";
import "./register.css";

export default function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useAppSelector(getLoadingState);
    const {auth} = useAuth();
    const params = useSearchParams();
    const [registerData, setData] = useState<
        RegisterEventDto["data"] | undefined
    >();
    const [error, setError] = useState(false);

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
        if (
            params.get("mode")! === ScreenMode.CHAT.toString() &&
            auth?.role !== UserRole.Student
        ) {
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
                    if (
                        _value.startsWith("#") &&
                        auth?.role === UserRole.Counselor
                    ) {
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
        let content = [];
        if (typeof _value === "string") {
            content.push(_value);
            setCommentData({
                ...commentData,
                content: content.join(","),
            });
        }

        if (typeof _value === "object") {
            content.push(_value.label);
            setCommentData({
                ...commentData,
                content: content.join(","),
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

    async function handleAddOrUpdate(e: SyntheticEvent<HTMLButtonElement>) {
        e?.preventDefault();
        if (registerData!?.eventName === "Event" || !registerData!?.eventName) {
            setError(true);
            return;
        }
        await registerEvent({
            username: auth?.username!,
            gradeName: auth?.grade!,
            data: registerData!,
        });
        router.back();
    }

    async function handleAddComment(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
    ) {
        event?.preventDefault();
        setOpenSuggest(false);
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
                            value={registerData!?.eventName ?? "Event"}
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
                            disabled={
                                isDisable ||
                                params.get("mode")! ===
                                    ScreenMode.EDIT.toString()
                            }
                        >
                            <MenuItem value="Event">Event</MenuItem>
                            {eventOptions!?.map(x => (
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

                    {error ? (
                        <span className="text-red-500 text-sm">
                            Must select an event!
                        </span>
                    ) : null}

                    {/* Events in school life */}
                    <Textarea
                        name="eventsInSchoolLife"
                        placeholder="Events in school life"
                        onChange={handleChange}
                        value={registerData!?.eventsInSchoolLife}
                        disabled={isDisable}
                    />

                    {/* My Actions */}
                    <Textarea
                        name="myAction"
                        placeholder="My Actions"
                        onChange={handleChange}
                        value={registerData!?.myAction}
                        disabled={isDisable}
                    />

                    {/* Shown power */}
                    <Textarea
                        name="shownPower"
                        placeholder="Shown power"
                        onChange={handleChange}
                        value={registerData!?.shownPower}
                        disabled={isDisable}
                    />

                    {/* Strength that has grown */}
                    <Textarea
                        name="strengthGrown"
                        placeholder="Strength that has grown"
                        onChange={handleChange}
                        value={registerData!?.strengthGrown}
                        disabled={isDisable}
                    />

                    {/* What I thought */}
                    <Textarea
                        name="myThought"
                        placeholder="What I thought"
                        onChange={handleChange}
                        value={registerData!?.myThought}
                        disabled={isDisable}
                    />

                    {auth?.role === UserRole.Student &&
                    [
                        ScreenMode.NEW.toString(),
                        ScreenMode.EDIT.toString(),
                    ].includes(params.get("mode")!) ? (
                        <button
                            className="border-none px-4 py-2 text-white rounded-md m-auto hover:cursor-pointer disabled:cursor-not-allowed"
                            style={{backgroundColor: "#4285f4"}}
                            onClick={async e => handleAddOrUpdate(e)}
                            disabled={isDisable || error}
                        >
                            {params.get("mode") !== ScreenMode.NEW.toString()
                                ? "Update"
                                : "Add"}
                        </button>
                    ) : null}
                </div>
            </div>

            <Suspense fallback={<>Loading comments...</>}>
                {params.get("mode") &&
                params.get("mode") !== ScreenMode.NEW.toString() ? (
                    <>
                        <div className="w-1/2 h-full m-auto flex flex-col gap-y-8 relative">
                            {comments!?.map(x => {
                                return (
                                    <Fragment key={x.id}>
                                        {x.isDeleted ? null : (
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
                                    className="absolute top-1 right-2 z-50"
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
                                    className="-rotate-[50deg]"
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        color: "#0078ff",
                                    }}
                                />
                            </button>
                        </div>
                    </>
                ) : null}
            </Suspense>
        </div>
    );
}
