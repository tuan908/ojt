"use client";

import type {Grade, StudentEvent} from "@/app/actions/common";
import {getStudents} from "@/app/actions/student";
import OjtColorHashtag from "@/components/ColorHashtag";
import {ITEM_HEIGHT, ITEM_PADDING_TOP, STRING_EMPTY} from "@/constants";
import {useAppDispatch} from "@/lib/redux/hooks";
import {hideLoading, showLoading} from "@/lib/redux/slice/loading.slice";
import type {
    Hashtag,
    StudentsRequest,
    StudentResponse,
} from "@/types/student.types";
import Clear from "@mui/icons-material/Clear";
import Search from "@mui/icons-material/Search";
import {
    Autocomplete,
    Input,
    MenuItem,
    Select,
    TextField,
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
} from "@mui/material";
import {SyntheticEvent, useEffect, useState} from "react";
import StudentDataGrid from "./_StudentDataGrid";

type SearchAreaProps = {
    rows: StudentResponse[];
    grades?: Grade[];
    hashtags?: Hashtag[];
    events?: StudentEvent[];
};

export default function SearchArea(props: SearchAreaProps) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<Array<{label: string; color: string}>>(
        []
    );
    const [inputValue, setInputValue] = useState(STRING_EMPTY);
    const [rows, setRows] = useState<StudentResponse[]>(props.rows);
    const [searchCondition, setCondition] = useState<StudentsRequest>({});

    function handleInputChange(
        event: SyntheticEvent,
        _value: string | {label: string; value: string} | null,
        reason: AutocompleteInputChangeReason
    ): void {
        event?.preventDefault();
        if (_value !== null) {
            switch (true) {
                case typeof _value === "string":
                    setInputValue(_value.trim());
                    if (_value.trim().startsWith("#")) {
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
            setInputValue(STRING_EMPTY);
            setOpen(false);
        }
    }

    function handleChange(
        event: SyntheticEvent<Element, Event>,
        _value: NonNullable<string | {label: string; id: number}>,
        reason: AutocompleteChangeReason
    ): void {
        event?.preventDefault();
        if (
            typeof _value === "string" &&
            !skills.find(x => x.label === _value.trim())
        ) {
            const hashtag = props.hashtags!?.find(x => x.name === _value);
            setSkills([
                ...skills,
                {label: hashtag?.name!, color: hashtag?.color!},
            ]);
        }

        if (
            typeof _value === "object" &&
            !skills.find(x => x.label === _value.label)
        ) {
            const hashtag = props.hashtags!?.find(x => x.id === _value.id);
            setSkills([
                ...skills,
                {label: hashtag?.name!, color: hashtag?.color!},
            ]);
        }

        if (reason === "selectOption" && open) {
            setOpen(false);
            if (inputValue !== STRING_EMPTY) setInputValue(STRING_EMPTY);
        }
    }

    useEffect(() => {
        setCondition({
            ...searchCondition,
            hashtags: skills.map(skill => skill.label),
        });
    }, [skills]);

    async function handleSearch(event: SyntheticEvent) {
        event?.preventDefault();
        await dispatch(showLoading());
        try {
            let request: StudentsRequest = {};
            if (searchCondition.grade !== "クラス名") {
                request.grade = searchCondition.grade;
            }

            if (searchCondition.events !== "イベント") {
                request.events = searchCondition.events;
            }

            const searchParams = {
                ...request,
                hashtags: searchCondition.hashtags,
                name: searchCondition.name,
            };

            const students = await getStudents(searchParams);
            setRows(students!);
        } catch (error: any) {
            throw new Error(error?.message);
        }

        await dispatch(hideLoading());
    }

    function handleRemoveHashtag(_index: number): void {
        setSkills(skills.filter((_, index) => index !== _index));
    }

    return (
        <>
            <div className="w-full pl-12 pt-8 flex flex-col gap-y-2 md:gap-x-8 md:flex-row">
                {/* 学生の名前 */}
                <Input
                    placeholder="学生の名前"
                    className="w-56"
                    sx={{bgcolor: "#ffffff", paddingX: 1}}
                    name="name"
                    onChange={e =>
                        setCondition(x => ({
                            ...x,
                            [e.target.name]: e.target.value,
                        }))
                    }
                />

                {/* クラス名 */}
                <Select
                    variant="standard"
                    className="w-56"
                    defaultValue="クラス名"
                    onChange={e =>
                        setCondition(x => ({
                            ...x,
                            grade: e.target.value as string,
                        }))
                    }
                    sx={{
                        bgcolor: "#ffffff",
                        paddingX: 1,
                        "& .MuiSelect-select:focus": {
                            bgcolor: "transparent",
                        },
                    }}
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
                    <MenuItem value="クラス名">クラス名</MenuItem>
                    {props.grades!?.map(x => (
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

                {/* イベント */}
                <Select
                    variant="standard"
                    className="w-56"
                    name="event"
                    defaultValue="イベント"
                    onChange={e =>
                        setCondition(x => ({
                            ...x,
                            events: e.target.value as string,
                        }))
                    }
                    sx={{
                        bgcolor: "#ffffff",
                        paddingX: 1,
                        "& .MuiSelect-select:focus": {
                            bgcolor: "transparent",
                        },
                    }}
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
                    <MenuItem value="イベント">イベント</MenuItem>
                    {props.events!?.map(x => (
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

                {/* ハッシュタグ */}
                <Autocomplete
                    sx={{
                        width: 224,
                        "& .MuiAutocomplete-inputRoot": {
                            flexWrap: "nowrap",
                            bgcolor: "#ffffff",
                            paddingX: 1,
                        },
                    }}
                    options={props.hashtags!?.map(x => ({
                        id: x.id,
                        label: x.name,
                    }))}
                    renderInput={params => (
                        <TextField
                            {...params}
                            placeholder="#ハッシュタグ"
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
            <div className="w-full px-12 flex gap-x-2 flex-wrap">
                {skills.map((skill, index) => (
                    <OjtColorHashtag
                        key={`skill#${index}`}
                        onRemove={() => handleRemoveHashtag(index)}
                        index={index}
                        color={skill.color}
                    >
                        {skill.label}
                    </OjtColorHashtag>
                ))}
            </div>
            <hr className="border-table" />
            <StudentDataGrid rows={rows} />
        </>
    );
}
