"use client";

import { addComment, createEvent, editComment } from "@/app/actions/event";
import { studentEventOptions } from "@/app/students/[id]/events/event";
import type { AddCommentPayload, TComment } from "@/features/comment/types";
import { RegisterEvent } from "@/features/student/types";
import BubbleMessage from "@/features/students/components/bubble-message";
import Textarea from "@/shared/components/legacy/textarea";
import { menuProps, QUERY_KEY, ScreenMode, UserRole } from "@/shared/constants";
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
import {
    useQuery,
    useQueryClient
} from "@tanstack/react-query";
import { X as Close, Send } from "lucide-react";
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
    studentCode: string;
    studentEventId: number;
    screenMode: string;
    events: IEvent[];
    hashtags: Hashtag[];
    session: ISession;
}

type EditCommentState = {
    id: number;
    isEditing: boolean;
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
}: IEventDetailContentProps) {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const { data: studentEvent } = useQuery(
        studentEventOptions({
            studentCode: session?.code,
            studentEventId: studentEventId.toString(),
        })
    );

    const [comments, setComments] = useState<TComment[]>([]);
    const [eventName, setEventName] = useState(() => json.event.placeholder0);
    const [registerData, setData] = useState<RegisterEvent["data"]>(
        () => studentEvent!?.data!
    );
    const [error, setError] = useState(false);
    const [disable, setDisable] = useState(false);
    const [openPicker, setOpen] = useState(false);
    const [newComment, setNewComment] = useState<string>("");
    const [editingComment, setEditingComment] = useState<TComment | null>(null);
    const [editState, setEditState] = useState<EditCommentState>(initEditState);
    const [openSuggest, setOpenSuggest] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (screenMode === ScreenMode.CHAT.toString()) {
            setDisable(true);
        }
    }, []);

    useEffect(() => {
        if (studentEvent) {
            setComments(studentEvent.comments);
            setEventName(studentEvent.name);
        }
    }, [studentEvent]);

    // Update the input change handler to work with both states
    function handleInputCommentChange(
        event: SyntheticEvent,
        input: string | { label: string; value: string } | null,
        reason: AutocompleteInputChangeReason
    ): void {
        event?.preventDefault();
        if (input === null) {
            return;
        }

        const content = typeof input === "string" ? input : input.value;

        // Update the appropriate state based on editing mode
        if (editState.isEditing && editingComment) {
            setEditingComment({
                ...editingComment,
                content,
            });
        } else {
            setNewComment(content);
        }

        // Handle hashtag suggestions
        if (content.startsWith("#") && session?.role === UserRole.Counselor) {
            setOpenSuggest(true);
        }

        if (reason === "reset") {
            setOpenSuggest(false);
        }

        if (openSuggest) {
            setOpenSuggest(false);
        }
    }

    // Update the change handler similarly
    function handleChangeComment(
        event: SyntheticEvent<Element, Event>,
        input: NonNullable<string | { id: number; label: string }>,
        reason: AutocompleteChangeReason
    ): void {
        event?.preventDefault();
        let content = [];
        if (typeof input === "string") {
            content.push(input);
        } else if (typeof input === "object") {
            content.push(input.label);
        }

        const finalContent = content.join(",");

        // Update the appropriate state based on editing mode
        if (editState.isEditing && editingComment) {
            setEditingComment({
                ...editingComment,
                content: finalContent,
            });
        } else {
            setNewComment(finalContent);
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

    const revalidate = () => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.EVENT, session?.code, studentEventId],
        });
    };

    async function handleAddComment(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
    ) {
        event?.preventDefault();

        if (!newComment.trim() || !session?.username) {
            return;
        }

        startTransition(async () => {
            await dispatch(showLoading());

            const data: AddCommentPayload = {
                content: newComment,
                studentEventId: Number(studentEventId),
                username: session.username,
            };

            const response = await addComment(data);
            if (response) {
                revalidate();
            }

            await dispatch(hideLoading());
            setOpenSuggest(false);
        });
    }

    // Separate function for updating an existing comment
    async function handleEditComment(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
    ) {
        event?.preventDefault();

        if (!editingComment || !editingComment?.content!?.trim()) {
            return;
        }

        startTransition(async () => {
            await dispatch(showLoading());

            const response = await editComment({
                id: editingComment.id,
                content: editingComment?.content!,
                studentEventId: Number(studentEventId),
            });

            if (response) {
                revalidate();
            }

            setEditingComment(null);
            setEditState(initEditState);
            await dispatch(hideLoading());
            setOpenSuggest(false);
        });
    }

    // Function to start editing a comment
    function startEditComment(comment: TComment) {
        setEditingComment(comment);
        setEditState({
            id: comment.id,
            isEditing: true,
        });
    }

    // Function to cancel editing
    function cancelEditComment() {
        setEditingComment(null);
        setEditState(initEditState);
    }

    // Handle emoji selection
    function handleSelect(emoji: any) {
        if (!emoji?.native) return;

        if (editState.isEditing && editingComment) {
            setEditingComment({
                ...editingComment,
                content: editingComment?.content!?.concat(emoji.native),
            });
        } else {
            setNewComment(newComment.concat(emoji.native));
        }
    }

    const inputRef = useRef<HTMLInputElement>(null);

    const commentRef = useRef<HTMLInputElement>(null);

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
                                        onEditStart={() =>
                                            startEditComment(comment)
                                        }
                                        comments={comments}
                                        setComments={setComments}
                                        editState={editState}
                                        setEditState={setEditState}
                                        isCommentOfActiveUser={
                                            session?.username! ===
                                            comment?.username!
                                        }
                                        inputRef={commentRef!}
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
                            inputValue={
                                editState.isEditing
                                    ? editingComment?.content || ""
                                    : newComment
                            }
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

                    {/* Update the action buttons */}
                    {editState.isEditing ? (
                        <>
                            <button
                                className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
                                onClick={handleEditComment}
                                disabled={
                                    !editingComment?.content ||
                                    editingComment.content.length === 0
                                }
                            >
                                <Send size={32} className="text-icon-default" />
                            </button>
                            <button
                                className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3"
                                onClick={cancelEditComment}
                            >
                                <Close
                                    className="text-icon-default"
                                    size={32}
                                />
                            </button>
                        </>
                    ) : (
                        <button
                            className="border-none outline-none bg-white rounded-full flex items-center justify-center p-3 disabled:cursor-not-allowed"
                            onClick={handleAddComment}
                            disabled={newComment.length === 0}
                        >
                            <Send size={32} className="text-icon-default" />
                        </button>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="flex flex-col w-full pt-20 pb-10">
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
        </div>
    );
}
