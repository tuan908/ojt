"use client";

import {
    addComment,
    editComment,
    registerEvent,
} from "@/app/actions/event.action";
import BubbleMessage from "@/components/BubbleMessage";
import ProgressIndicator from "@/components/ProgressIndicator";
import {type SelectOption} from "@/components/Select";
import Textarea from "@/components/Textarea";
import {menuProps, ScreenMode, UserRole} from "@/constants";
import json from "@/i18n/jp.json";
import type {JwtPayload} from "@/lib/auth";
import {hideLoading, showLoading} from "@/redux/features/loading/loading.slice";
import {useAppDispatch} from "@/redux/hooks";
import type {EventDetail} from "@/types/student";
import data from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import Close from "@mui/icons-material/Close";
import Send from "@mui/icons-material/Send";
import SentimentSatisfiedAlt from "@mui/icons-material/SentimentSatisfiedAlt";
import {
    Autocomplete,
    Avatar,
    MenuItem,
    Select,
    TextField,
    useMediaQuery,
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
    type SelectProps,
} from "@mui/material";
import {useRouter} from "next/navigation";
import {
    Fragment,
    useEffect,
    useRef,
    useState,
    useTransition,
    type ComponentProps,
    type SyntheticEvent,
} from "react";
import type {HashtagPayload} from "@/app/actions/common.action";
import type {
    RegisterEvent,
    AddCommentPayload,
    Comment
} from "@/types/event-action.types";

type Props = Partial<{
    eventDetailId: number;
    mode: string;
    detail: EventDetail;
    events: SelectOption[];
    hashtags: HashtagPayload[];
    auth: JwtPayload;
}> & {studentCode: string};

type CommentState = {
    id: number;
    eventDetailId: number;
    content: string;
    username: string;
};

type EditCommentState = {
    id: number;
    isEditing: boolean;
};

const initComment: CommentState = {
    id: -1,
    eventDetailId: -1,
    content: "",
    username: "",
};

const initEditState: EditCommentState = {
    id: -1,
    isEditing: false,
};

const inputProps = {
    className: "!p-1",
};

export default function EventUi({
    studentCode,
    detail,
    events: _events,
    hashtags: _hashtags,
    eventDetailId,
    mode,
    auth,
}: Props) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [comments, setComments] = useState<Comment[]>([]);
    const [eventName, setEventName] = useState(json.event.placeholder_0);
    const [registerData, setData] = useState<RegisterEvent["data"]>();
    const [error, setError] = useState(false);
    const [eventOptions, setEventOptions] = useState<SelectOption[]>([]);
    const [disable, setDisable] = useState(false);
    const [hashtags, setHashtags] = useState<HashtagPayload[]>([]);
    const [openPicker, setOpen] = useState(false);
    const [comment, setComment] = useState<AddCommentPayload>(initComment);
    const [openSuggest, setOpenSuggest] = useState(false);
    const [editState, setEditState] = useState<EditCommentState>(initEditState);
    const [isPending, startTransition] = useTransition();
    const matches = useMediaQuery("(min-width:1024px)");

    useEffect(() => {
        setEventName(detail!?.name ?? json.event.placeholder_0);
        setData({
            eventName: detail!?.name,
            eventsInSchoolLife: detail!?.data?.eventsInSchoolLife,
            myAction: detail?.data?.myAction,
            myThought: detail?.data?.myThought,
            shownPower: detail?.data?.shownPower,
            strengthGrown: detail?.data?.strengthGrown,
        });
        setComments(detail!?.comments);

        setEventOptions(_events!);
        setHashtags(_hashtags!);

        if (
            mode! === ScreenMode.CHAT.toString() &&
            auth?.role !== UserRole.Student
        ) {
            setDisable(true);
        }
    }, []);

    function handleInputCommentChange(
        event: SyntheticEvent,
        _value: string | {label: string; value: string} | null,
        reason: AutocompleteInputChangeReason
    ): void {
        event?.preventDefault();
        if (_value !== null) {
            switch (true) {
                case typeof _value === "string":
                    setComment({...comment, content: _value});
                    if (
                        _value.startsWith("#") &&
                        auth?.role === UserRole.Counselor
                    ) {
                        setOpenSuggest(true);
                    }
                    break;

                case typeof _value === "object":
                    setComment({
                        ...comment,
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

        if (openSuggest) {
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
            setComment({
                ...comment,
                content: content.join(","),
            });
        }

        if (typeof _value === "object") {
            content.push(_value.label);
            setComment({
                ...comment,
                content: content.join(","),
            });
        }

        if (reason === "selectOption" && openSuggest) {
            setOpenSuggest(false);
        }
    }

    const handleSelectChange: SelectProps<string>["onChange"] = e => {
        if (error) {
            setError(false);
            return;
        }
        setEventName(e.target.value);
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
        if (eventName === json.event.placeholder_0) {
            setError(true);
            return;
        } else {
            await registerEvent({
                studentCode,
                username: auth?.username!,
                gradeName: auth?.grade!,
                data: {...registerData!, eventName},
            });
            router.back();
        }
    }

    function handleAddComment(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
    ) {
        event?.preventDefault();
        startTransition(async () => {
            if (editState.isEditing) {
                const response = await editComment({
                    id: comment.id!,
                    content: comment.content!,
                    eventDetailId: eventDetailId!,
                });
                if (response) {
                    setComments(prev =>
                        [
                            ...prev.filter(x => x.id !== comment.id!),
                            response.data as Comment,
                        ].sort((a, b) => a.id - b.id)
                    );
                }
                setComment(initComment);
                setEditState(initEditState);
            } else {
                if (auth && auth.username) {
                    await dispatch(showLoading());
                    let data: AddCommentPayload = {
                        ...comment,
                        eventDetailId: eventDetailId!,
                        username: auth.username,
                    };
                    const res = await addComment(data);
                    if (res) {
                        setComments(res);
                        setComment({...comment, content: ""});
                    }
                    await dispatch(hideLoading());
                }
            }
            setOpenSuggest(false);
        });
    }

    function handleSelect(emoji: any) {
        if (!emoji?.native) return;
        setComment({
            ...comment,
            content: comment?.content!?.concat(emoji?.native),
        });
    }

    const exitEditComment = () => {
        setComment(initComment);
        setEditState(initEditState);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Fragment>
            <div className="pt-6 w-full flex flex-col gap-y-4 relative">
                {isPending && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#454545] opacity-30 flex items-center justify-center z-1301">
                        <ProgressIndicator />
                    </div>
                )}
                <div className="w-4/5 md:w-1/2 m-auto bg-white rounded-xl shadow-sm">
                    <div className="w-[90%] m-auto flex flex-col gap-y-4 py-6">
                        {/* Select */}
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="selectEvent">
                                {json.event.select_event}
                            </label>
                            <Select
                                variant="outlined"
                                className="w-full border-default disabled:cursor-not-allowed"
                                placeholder="Select Event"
                                value={eventName}
                                sx={{bgcolor: "#ffffff", paddingX: 1}}
                                MenuProps={menuProps}
                                onChange={handleSelectChange}
                                disabled={
                                    disable ||
                                    mode! === ScreenMode.EDIT.toString() ||
                                    (auth?.role! ===
                                        UserRole.Student.toString() &&
                                        mode !== ScreenMode.NEW.toString())
                                }
                                inputProps={!matches ? inputProps : undefined}
                            >
                                <MenuItem value={json.event.placeholder_0}>
                                    {json.event.placeholder_0}
                                </MenuItem>
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
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_1}
                            </label>
                            <Textarea
                                name="eventsInSchoolLife"
                                placeholder={json.event.placeholder_1}
                                onChange={handleChange}
                                value={registerData!?.eventsInSchoolLife}
                                disabled={disable}
                            />
                        </div>

                        {/* My Actions */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_2}
                            </label>
                            <Textarea
                                name="myAction"
                                placeholder={json.event.placeholder_2}
                                onChange={handleChange}
                                value={registerData!?.myAction}
                                disabled={disable}
                            />
                        </div>

                        {/* Shown power */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_3}
                            </label>
                            <Textarea
                                name="shownPower"
                                placeholder={json.event.placeholder_3}
                                onChange={handleChange}
                                value={registerData!?.shownPower}
                                disabled={disable}
                            />
                        </div>

                        {/* Strength that has grown */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_4}
                            </label>
                            <Textarea
                                name="strengthGrown"
                                placeholder={json.event.placeholder_4}
                                onChange={handleChange}
                                value={registerData!?.strengthGrown}
                                disabled={disable}
                            />
                        </div>

                        {/* What I thought */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_5}
                            </label>
                            <Textarea
                                name="myThought"
                                placeholder={json.event.placeholder_5}
                                onChange={handleChange}
                                value={registerData!?.myThought}
                                disabled={disable}
                            />
                        </div>

                        {auth?.role === UserRole.Student &&
                        [
                            ScreenMode.NEW.toString(),
                            ScreenMode.EDIT.toString(),
                        ].includes(mode!) ? (
                            <button
                                className="border-none px-4 py-2 text-white rounded-md m-auto hover:cursor-pointer disabled:cursor-not-allowed"
                                style={{backgroundColor: "#4285f4"}}
                                onClick={async e => handleAddOrUpdate(e)}
                                disabled={disable || error}
                            >
                                {mode !== ScreenMode.NEW.toString()
                                    ? "Update"
                                    : "Add"}
                            </button>
                        ) : null}
                    </div>
                </div>

                {mode! && mode! === ScreenMode.CHAT.toString() ? (
                    <>
                        <div className="w-4/5 md:w-1/2 h-full m-auto flex flex-col gap-y-4 relative">
                            {comments!?.map(comment => {
                                return (
                                    <Fragment key={comment.id}>
                                        {comment.isDeleted ? null : (
                                            <BubbleMessage
                                                comment={comment}
                                                setComment={setComment}
                                                comments={comments}
                                                setComments={setComments}
                                                editState={editState}
                                                setEditState={setEditState}
                                                isCommentOfActiveUser={
                                                    auth?.username! ===
                                                    comment?.username!
                                                }
                                                inputRef={inputRef}
                                            />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>
                        <div className="w-11/12 md:w-3/5 m-auto flex items-center gap-x-2 md:gap-x-8">
                            <Avatar className="!hidden md:!block md:!w-16 md:!h-16" />
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
                                    options={hashtags?.map(x => ({
                                        label: x.name,
                                        id: x.id,
                                    }))}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            placeholder="Input comment here..."
                                            multiline
                                            variant="outlined"
                                            rows={!matches ? 1 : 2}
                                            inputRef={inputRef}
                                            sx={{
                                                padding: 0,
                                                fontSize: 1,
                                            }}
                                        />
                                    )}
                                    onInputChange={handleInputCommentChange}
                                    onChange={handleChangeComment}
                                    open={openSuggest}
                                    inputValue={comment.content}
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
                                    <div className="absolute -right-12 -top-0 lg:top-6">
                                        <EmojiPicker
                                            data={data}
                                            onEmojiSelect={handleSelect}
                                            open={openPicker}
                                            previewPosition="none"
                                            onClickOutside={() =>
                                                setOpen(false)
                                            }
                                        />
                                    </div>
                                ) : null}
                            </div>
                            <button
                                className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
                                onClick={handleAddComment}
                                disabled={comment?.content!?.length === 0}
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
                            {editState.isEditing ? (
                                <button
                                    className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
                                    onClick={exitEditComment}
                                    disabled={comment?.content!?.length === 0}
                                >
                                    <Close
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            color: "#0078ff",
                                        }}
                                    />
                                </button>
                            ) : null}
                        </div>
                    </>
                ) : null}
            </div>
        </Fragment>
    );
}
