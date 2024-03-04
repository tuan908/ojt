"use client";

import TableCell from "@/components/TableCell";
import TableHead from "@/components/TableHead";
import TableRow from "@/components/TableRow";
import Analytics from "@mui/icons-material/Analytics";
import Clear from "@mui/icons-material/Clear";
import Search from "@mui/icons-material/Search";
import Autocomplete, {
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {useState, type SyntheticEvent} from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function Page() {
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    function handleInputChange(
        event: SyntheticEvent,
        _value: string | {label: string; value: string} | null,
        reason: AutocompleteInputChangeReason
    ): void {
        event?.preventDefault();
        if (_value !== null) {
            switch (true) {
                case typeof _value === "string":
                    setInputValue(_value);
                    if (_value.startsWith("#")) {
                        setOpen(true);
                    }
                    break;

                case typeof _value === "object":
                    setInputValue(_value.value);
                    break;

                default:
                    throw new Error("Invalid input");
            }
        }

        if (reason === "reset") {
            setInputValue("");
            setOpen(false);
        }
    }

    function handleChange(
        event: SyntheticEvent<Element, Event>,
        _value: NonNullable<string | {label: string; value: string}>,
        reason: AutocompleteChangeReason
    ): void {
        event?.preventDefault();
        if (typeof _value === "string") {
            setSkills([...skills, _value]);
        }

        if (typeof _value === "object") {
            setSkills([...skills, _value.value]);
        }

        if (reason === "selectOption" && open) {
            setOpen(false);
        }
    }

    function handleSearch(event: SyntheticEvent): void {
        event?.preventDefault();
        throw new Error("Function not implemented.");
    }

    function handleRemove(_index: number): void {
        setSkills(skills.filter((_, index) => index !== _index));
    }

    return (
        <div className="bg-[#ededed] h-full p-12 flex flex-col gap-y-6">
            {/* Student info */}
            <div className="flex gap-x-8">
                {/* Student name */}
                <Input
                    placeholder="Student Name"
                    sx={{bgcolor: "#ffffff", paddingX: 1}}
                />

                {/* School's year */}
                <Select
                    variant="standard"
                    className="w-32"
                    placeholder="School Year"
                    defaultValue="School Year"
                    sx={{bgcolor: "#ffffff", paddingX: 1}}
                    MenuProps={{
                        slotProps: {
                            paper: {
                                style: {
                                    maxHeight:
                                        ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                },
                            },
                        },
                    }}
                >
                    <MenuItem value="School Year">School Year</MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => (
                        <MenuItem key={x} value={x}>
                            Year {x}
                        </MenuItem>
                    ))}
                </Select>

                {/* Event */}
                <Select
                    variant="standard"
                    className="w-32"
                    defaultValue="Event"
                    sx={{bgcolor: "#ffffff", paddingX: 1}}
                    MenuProps={{
                        slotProps: {
                            paper: {
                                style: {
                                    maxHeight:
                                        ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                },
                            },
                        },
                    }}
                    suppressContentEditableWarning
                >
                    <MenuItem value="Event">Event</MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => (
                        <MenuItem key={x} value={x}>
                            Event {x}
                        </MenuItem>
                    ))}
                </Select>

                {/* Hashtag */}
                <Autocomplete
                    sx={{
                        width: 240,
                        "& .MuiAutocomplete-inputRoot": {
                            flexWrap: "nowrap",
                        },
                    }}
                    options={[
                        {label: "#Skill1", value: "#Skill1"},
                        {label: "#Skill2", value: "#Skill2"},
                    ]}
                    renderInput={params => (
                        <TextField
                            {...params}
                            placeholder="#hashtag"
                            variant="standard"
                        />
                    )}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    open={open}
                    inputValue={inputValue}
                    ChipProps={{
                        sx: {
                            bgcolor: "transparent",
                        },
                        clickable: false,
                        deleteIcon: <Clear />,
                    }}
                    disableListWrap
                    disableClearable
                    disablePortal
                    freeSolo
                />

                {/* Search Button */}
                <button
                    className="border-none outline-none flex items-center justify-center"
                    onClick={handleSearch}
                >
                    <Search
                        className="text-icon-default"
                        sx={{width: 32, height: 32}}
                    />
                </button>
            </div>
            <div className="flex gap-x-2 flex-wrap">
                {skills.map((x, index) => (
                    <div
                        className="flex items-center justify-center leading-none bg-white shadow-md rounded-xl px-2 py-2 gap-x-2"
                        key={`skill#${index}`}
                    >
                        <span>{x}</span>
                        <button
                            className="border-none outline-none flex items-center justify-center"
                            onClick={() => handleRemove(index)}
                        >
                            <Clear sx={{width: 16, height: 16}} />
                        </button>
                    </div>
                ))}
            </div>
            {/* Table */}
            <table className="border border-table border-collapse align-middle">
                <thead>
                    <tr className="bg-[#3f51b5] text-[#fffffc]">
                        <TableHead>Student Code</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>School Year</TableHead>
                        <TableHead>Events</TableHead>
                        <TableHead>Hashtags</TableHead>
                        <TableHead>Trackings</TableHead>
                    </tr>
                </thead>
                <tbody>
                    <TableRow>
                        <TableCell alignTextCenter>ST00001</TableCell>
                        <TableCell alignTextCenter>明日香</TableCell>
                        <TableCell alignTextCenter>四年生</TableCell>
                        <TableCell fontSemibold textEllipsis>
                            イベンド７，サッカ―，バドミントン
                        </TableCell>
                        <TableCell fontSemibold textEllipsis>
                            <div className="w-full flex gap-x-2">
                                <span className="text-[#f2afbb]">#主体性</span>
                                <span className=" text-[#7071ef]">
                                    #状況把握力
                                </span>
                                <span className=" text-[#b9c8d3]">#規律性</span>
                            </div>
                        </TableCell>
                        <TableCell alignTextCenter>
                            <Analytics className="text-icon-default" />
                        </TableCell>
                    </TableRow>
                </tbody>
            </table>
            {/*  */}
        </div>
    );
}
