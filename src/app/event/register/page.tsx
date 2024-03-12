"use client";

import {
    addComment,
    registerEvent,
    type CommentDto,
    type RegisterEventDto,
} from "@/app/actions/event";
import {ITEM_HEIGHT, ITEM_PADDING_TOP} from "@/constants";

import Textarea from "@/components/Textarea";
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
import {useState, type ComponentProps, type SyntheticEvent} from "react";
import "./register.css";

export default function Page() {
    const [registerData, setData] = useState<RegisterEventDto>({
        eventName: "",
        eventsInSchoolLife: "",
        myAction: "",
        myThought: "",
        shownPower: "",
        strengthGrown: "",
    });

    const [comments, setComments] = useState<[]>([]);
    const [openPicker, setOpen] = useState(false);
    const [commentData, setCommentData] = useState<CommentDto>({
        commentContent: "",
        createdDate: new Date(),
        updatedDate: new Date(),
        username: "",
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
                    setCommentData({...commentData, commentContent: _value});
                    if (_value.startsWith("#")) {
                        setOpenSuggest(true);
                    }
                    break;

                case typeof _value === "object":
                    setCommentData({
                        ...commentData,
                        commentContent: _value.value,
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
        _value: NonNullable<string | {label: string; id: string}>,
        reason: AutocompleteChangeReason
    ): void {
        event?.preventDefault();
        if (typeof _value === "string") {
            setCommentData({
                ...commentData,
                commentContent: commentData.commentContent.concat(_value, " "),
            });
        }

        if (typeof _value === "object") {
            setCommentData({
                ...commentData,
                commentContent: commentData.commentContent.concat(
                    _value.label,
                    " "
                ),
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
        await registerEvent(registerData);
    }

    async function handleAddComment(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
    ) {
        event?.preventDefault();
        await addComment(commentData);
    }

    function handleSelect(emoji: any) {
        if (!emoji?.native) return;
        setCommentData({
            ...commentData,
            commentContent: commentData.commentContent.concat(emoji?.native),
        });
    }

    return (
        <div className="pt-12 w-full flex flex-col gap-y-8">
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
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => (
                                <MenuItem
                                    key={x}
                                    value={`Event ${x}`}
                                    disableRipple
                                    disableTouchRipple
                                >
                                    Event {x}
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
                        options={[
                            {label: "#independence", id: "0"},
                            {label: "#ability to quickly grasp", id: "1"},
                            {label: "#discipline", id: "2"},
                        ]}
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
                        inputValue={commentData.commentContent}
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
