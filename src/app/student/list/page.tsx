"use client";

import Clear from "@mui/icons-material/Clear";
import Autocomplete, {
    AutocompleteCloseReason,
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
        value: string | {label: string; value: string} | null
    ): void {
        event?.preventDefault();
        if (typeof value === "string" && value.startsWith("#")) {
            setOpen(true);
        } else {
            handleClose(event);
        }
    }

    function handleChange(
        event: SyntheticEvent<Element, Event>,
        _value: NonNullable<string | {label: string; value: string}>
    ): void {
        event?.preventDefault();
        if (typeof _value === "string") {
            setSkills([...skills, _value]);
        }

        if (typeof _value === "object") {
            setSkills([...skills, _value.value]);
        }
        handleClose(event);
    }

    function handleClose(event: SyntheticEvent<Element, Event>): void {
        event.preventDefault();
        setOpen(false);
    }

    return (
        <div className="bg-[#ededed] h-full p-12 flex flex-col gap-y-12">
            {/* Student info */}
            <div className="flex gap-x-8">
                {/* Student name */}
                <Input placeholder="学生の名前" className="bg-white" />
                {/* School's year */}
                <select className="border-b border-b-default outline-none w-32 px-4">
                    <option>学年</option>
                    {[1, 2, 3, 4, 5].map(x => (
                        <option key={x} className="p-4">
                            小{x}
                        </option>
                    ))}
                </select>
                <Select
                    labelId="selectSchoolYear"
                    variant="standard"
                    className="w-32"
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
                    <MenuItem value="学年">学年</MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => (
                        <MenuItem key={x} value={x}>
                            小{x}
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
                    renderInput={x => (
                        <TextField
                            {...x}
                            placeholder="#ハッシュタグ"
                            variant="standard"
                        />
                    )}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    open={open}
                    onClose={handleClose}
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
                    inputValue={inputValue}
                />
            </div>
            <div className="flex gap-x-2">
                {skills.map((x, index) => (
                    <span key={index}>{x}</span>
                ))}
            </div>
            {/* Table */}
            <table className="border border-collapse">
                <thead>
                    <tr>
                        <th className="border border-default">学生コード</th>
                        <th className="border border-default">学生の名前</th>
                        <th className="border border-default">学年</th>
                        <th className="border border-default">イベント</th>
                        <th className="border border-default">ハッシュタグ</th>
                        <th className="border border-default">トラッキング</th>
                    </tr>
                </thead>
            </table>
            {/*  */}
        </div>
    );
}
