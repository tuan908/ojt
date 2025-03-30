"use client";

import { addComment, createEvent, editComment } from "@/app/actions/event";
import type { AddCommentPayload, TComment } from "@/features/comment/types";
import { RegisterEvent, StudentEvent } from "@/features/student/types";
import BubbleMessage from "@/features/students/components/bubble-message";
import Textarea from "@/shared/components/legacy/textarea";
import { menuProps, ScreenMode, UserRole } from "@/shared/constants";
import json from "@/shared/i18n/locales/ja.json";
import { ISession } from "@/shared/lib/session";
import { hideLoading, showLoading } from "@/shared/redux/features/loadingSlice";
import { useAppDispatch } from "@/shared/redux/hooks";
import type { Hashtag } from "@/shared/types";
import { type IEvent } from "@/shared/types";
import data from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import SentimentSatisfiedAlt from "@mui/icons-material/SentimentSatisfiedAlt";
import {
    Autocomplete,
    Avatar,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
    type SelectProps,
} from "@mui/material";
import { X as Close, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Fragment,
    useEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
    type ComponentProps,
    type SyntheticEvent,
} from "react";

interface IEventDetailContentProps {
    studentId: string;
    studentEventId: number;
    screenMode: string;
    studentEvent: StudentEvent;
    events: IEvent[];
    hashtags: Hashtag[];
    session: ISession;
}

type CommentState = {
    id: number;
    studentEventId: number;
    content: string;
    username: string;
};

type EditCommentState = {
    id: number;
    isEditing: boolean;
};

const initComment: CommentState = {
    id: -1,
    studentEventId: -1,
    content: "",
    username: "",
};

const initEditState: EditCommentState = {
    id: -1,
    isEditing: false,
};

export default function StudentEventContent({
    events,
    hashtags,
    studentEventId,
    screenMode,
    session,
    studentEvent,
}: IEventDetailContentProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [comments, setComments] = useState<TComment[]>([]);
    const [eventName, setEventName] = useState(
        studentEvent?.name ?? json.event.placeholder0
    );
    const [registerData, setData] = useState<RegisterEvent["data"]>(() => studentEvent.data!);
    const [error, setError] = useState(false);
    const [disable, setDisable] = useState(false);
    const [openPicker, setOpen] = useState(false);
    const [comment, setComment] = useState<AddCommentPayload>(initComment);
    const [openSuggest, setOpenSuggest] = useState(false);
    const [editState, setEditState] = useState<EditCommentState>(initEditState);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (
            screenMode === ScreenMode.CHAT.toString() &&
            session?.role !== UserRole.Student
        ) {
            setDisable(true);
        }
    }, []);

    function handleInputCommentChange(
        event: SyntheticEvent,
        input: string | { label: string; value: string } | null,
        reason: AutocompleteInputChangeReason
    ): void {
        event?.preventDefault();
        if (input === null) {
            return;
        }

        if (typeof input === "string") {
            setComment({ ...comment, content: input });
            if (input.startsWith("#") && session?.role === UserRole.Counselor) {
                setOpenSuggest(true);
            }
        }

        if (typeof input === "object") {
            setComment({
                ...comment,
                content: input.value,
            });
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
        input: NonNullable<string | { id: number; label: string }>,
        reason: AutocompleteChangeReason
    ): void {
        event?.preventDefault();
        let content = [];
        if (typeof input === "string") {
            content.push(input);
            setComment({
                ...comment,
                content: content.join(","),
            });
        }

        if (typeof input === "object") {
            content.push(input.label);
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
        if (disable) return;
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
            [e?.target.name]: e?.target.value!,
        });
    };

    async function handleMutation(e: SyntheticEvent<HTMLButtonElement>) {
        e?.preventDefault();
        if (!registerData?.eventName) {
            setError(true);
            return;
        } else {
            await createEvent({
                data: registerData,
                gradeName: session?.grade,
                studentCode: session?.code,
                username: session?.username,
            });
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
                    studentEventId: Number(studentEventId),
                });
                if (response) {
                    setComments([]);
                }
                setComment(initComment);
                setEditState(initEditState);
            } else {
                if (session && session?.username) {
                    await dispatch(showLoading());
                    let data: AddCommentPayload = {
                        ...comment,
                        studentEventId: Number(studentEventId),
                        username: session.username,
                    };
                    const res = await addComment(data);
                    if (res) {
                        setComments([]);
                        setComment({ ...comment, content: "" });
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

    const isSelectDisabled = useMemo(
        () =>
            disable ||
            screenMode === ScreenMode.EDIT.toString() ||
            (session?.role === UserRole.Student.toString() &&
                screenMode !== ScreenMode.NEW.toString()),
        [disable, screenMode, session]
    );

    const isShowComments = useMemo(
        () => screenMode === ScreenMode.CHAT.toString(),
        [screenMode]
    );

    const renderComments = () => {
        if (!isShowComments) return null;

        return (
            <>
                <div className="w-4/5 md:w-1/2 m-auto flex flex-col gap-y-4 relative">
                    {comments.map(comment => {
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
                                            session?.username! ===
                                            comment?.username!
                                        }
                                        inputRef={inputRef!}
                                    />
                                )}
                            </Fragment>
                        );
                    })}
                </div>

                <div className="w-11/12 md:w-3/5 m-auto flex items-center gap-x-2 md:gap-x-8">
                    <Avatar className="!hidden md:!flex md:!w-16 md:!h-16" />
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
                                id: x.id,
                                label: x.name,
                            }))}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    placeholder={json.event.addComment}
                                    multiline
                                    variant="outlined"
                                    rows={2}
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
                        <Tooltip title={json.common.emoji}>
                            <button
                                onClick={() => setOpen(!openPicker)}
                                className="absolute top-1 right-2 z-50"
                            >
                                <SentimentSatisfiedAlt
                                    sx={{ width: 22, height: 22 }}
                                />
                            </button>
                        </Tooltip>
                        {openPicker ? (
                            <div className="absolute -right-12 -top-0 lg:top-0">
                                <EmojiPicker
                                    data={data}
                                    onEmojiSelect={handleSelect}
                                    open={openPicker}
                                    previewPosition="none"
                                    onClickOutside={() => setOpen(false)}
                                />
                            </div>
                        ) : null}
                    </div>
                    <button
                        className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
                        onClick={handleAddComment}
                        disabled={comment?.content!?.length === 0}
                    >
                        <Send size={32} className="text-icon-default" />
                    </button>
                    {editState.isEditing ? (
                        <button
                            className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
                            onClick={exitEditComment}
                            disabled={comment?.content!?.length === 0}
                        >
                            <Close className="text-icon-default" size={32} />
                        </button>
                    ) : null}
                </div>
            </>
        );
    };

    return (
        <Fragment>
            <div className="pt-6 w-full flex flex-col gap-y-4 relative">
                <div className="w-4/5 md:w-1/2 m-auto bg-white rounded-xl shadow-sm">
                    <div className="w-[90%] m-auto flex flex-col gap-y-4 py-6">
                        {/* Select */}
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="selectEvent">
                                {json.event.selectEvent}
                            </label>
                            <Select
                                variant="outlined"
                                className="w-full border-default disabled:cursor-not-allowed"
                                value={eventName}
                                sx={{ bgcolor: "#ffffff", paddingX: 1 }}
                                MenuProps={menuProps}
                                onChange={handleSelectChange}
                                disabled={isSelectDisabled}
                            >
                                <MenuItem value={eventName} disabled>
                                    {eventName}
                                </MenuItem>
                                {events!?.map(x => (
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
                                {json.event.question1}
                            </label>
                            <Textarea
                                name="eventsInSchoolLife"
                                placeholder={json.event.placeholder1}
                                onChange={handleChange}
                                value={registerData!?.eventsInSchoolLife}
                                disabled={disable}
                            />
                        </div>

                        {/* My Actions */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question2}
                            </label>
                            <Textarea
                                name="myAction"
                                placeholder={json.event.placeholder2}
                                onChange={handleChange}
                                value={registerData!?.myAction}
                                disabled={disable}
                            />
                        </div>

                        {/* Shown power */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question3}
                            </label>
                            <Textarea
                                name="shownPower"
                                placeholder={json.event.placeholder3}
                                onChange={handleChange}
                                value={registerData!?.shownPower}
                                disabled={disable}
                            />
                        </div>

                        {/* Strength that has grown */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question4}
                            </label>
                            <Textarea
                                name="strengthGrown"
                                placeholder={json.event.placeholder4}
                                onChange={handleChange}
                                value={registerData!?.strengthGrown}
                                disabled={disable}
                            />
                        </div>

                        {/* What I thought */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question5}
                            </label>
                            <Textarea
                                name="myThought"
                                placeholder={json.event.placeholder5}
                                onChange={handleChange}
                                value={registerData!?.myThought}
                                disabled={disable}
                            />
                        </div>

                        {session?.role === UserRole.Student &&
                        [
                            ScreenMode.NEW.toString(),
                            ScreenMode.EDIT.toString(),
                        ].includes(screenMode!) ? (
                            <button
                                className="w-full border-none px-4 py-2 text-white rounded-md m-auto hover:cursor-pointer disabled:cursor-not-allowed bg-[#4285f4]"
                                onClick={async e => handleMutation(e)}
                                disabled={disable || error}
                            >
                                {screenMode !== ScreenMode.NEW.toString() ? (
                                    <span>更新</span>
                                ) : (
                                    <span>追加</span>
                                )}
                            </button>
                        ) : null}
                    </div>
                </div>

                {renderComments()}
            </div>
        </Fragment>
    );
}
