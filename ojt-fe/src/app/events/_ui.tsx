"use client";

import {
    addComment,
    editComment,
    registerEvent,
    type AddCommentPayload,
    type Comment,
    type RegisterEvent,
} from "@/app/actions/event.action";
import BubbleMessage from "@/components/BubbleMessage";
import Textarea from "@/components/Textarea";
import {ITEM_HEIGHT, ITEM_PADDING_TOP, ScreenMode, UserRole} from "@/constants";
import type {JwtPayload} from "@/lib/auth";
import {hideLoading, showLoading} from "@/redux/features/loading/loading.slice";
import {useAppDispatch} from "@/redux/hooks";
import type {EventDetail} from "@/types/student.types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Close from "@mui/icons-material/Close";
import Send from "@mui/icons-material/Send";
import SentimentSatisfiedAlt from "@mui/icons-material/SentimentSatisfiedAlt";
import {
    Autocomplete,
    Avatar,
    MenuItem,
    Select,
    TextField,
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
    type SelectProps,
} from "@mui/material";
import {useRouter} from "next/navigation";
import {
    Fragment,
    useEffect,
    useState,
    type ComponentProps,
    type SyntheticEvent,
} from "react";
import type {HashtagPayload, StudentEvent} from "../actions/common.action";

type Props = Partial<{
    id: number;
    mode: string;
    detail: EventDetail;
    events: StudentEvent[];
    hashtags: HashtagPayload[];
    auth: JwtPayload;
}>;

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

export default function EventUi({
    detail,
    events: _events,
    hashtags: _hashtags,
    id,
    mode,
    auth,
}: Props) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [comments, setComments] = useState<Comment[]>([]);
    const [registerData, setData] = useState<RegisterEvent["data"]>();
    const [error, setError] = useState(false);
    const [eventOptions, setEventOptions] = useState<StudentEvent[]>([]);
    const [isDisable, setDisable] = useState(false);
    const [hashtags, setHashtags] = useState<HashtagPayload[]>([]);
    const [openPicker, setOpen] = useState(false);
    const [comment, setComment] = useState<AddCommentPayload>(initComment);
    const [openSuggest, setOpenSuggest] = useState(false);
    const [editState, setEditState] = useState<EditCommentState>(initEditState);

    useEffect(() => {
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
        }
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
        } else {
            await registerEvent({
                username: auth?.username!,
                gradeName: auth?.grade!,
                data: registerData!,
            });
            router.back();
        }
    }

    async function handleAddComment(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
    ) {
        event?.preventDefault();
        if (editState.isEditing) {
            const response = await editComment(comment.id!, comment.content!);
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
                    eventDetailId: id!,
                    username: auth.username,
                };
                await addComment(data)
                    .then(async res => {
                        if (res) {
                            setComments(res);
                            setComment({...comment, content: ""});
                        }
                    })
                    .finally(async () => {
                        await dispatch(hideLoading());
                    });
            }
        }
        setOpenSuggest(false);
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

    return (
        <Fragment>
            <div className="pt-12 w-full flex flex-col gap-y-8">
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
                                    mode! === ScreenMode.EDIT.toString()
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
                        ].includes(mode!) ? (
                            <button
                                className="border-none px-4 py-2 text-white rounded-md m-auto hover:cursor-pointer disabled:cursor-not-allowed"
                                style={{backgroundColor: "#4285f4"}}
                                onClick={async e => handleAddOrUpdate(e)}
                                disabled={isDisable || error}
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
                        <div className="w-1/2 h-full m-auto flex flex-col gap-y-4 relative">
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
                                            />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>
                        <div className="w-11/12 md:w-3/5 m-auto flex items-center gap-x-8">
                            <Avatar className="md:!w-16 md:!h-16" />
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
                                            rows={2}
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
                                    <div className="absolute right-0 -top-24">
                                        <Picker
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
