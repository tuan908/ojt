"use client";

import { getStudents } from "@/app/actions/student";
import ColorHashtag from "@/components/ui/color-hashtag";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import {
    DEFAULT_EVENT_OPTION,
    DEFAULT_GRADE_NAME_OPTION,
    STRING_EMPTY,
} from "@/constants";
import json from "@/i18n/locales/ja.json";
import {
    hideLoading,
    showLoading,
} from "@/redux/features/loading/loading.slice";
import { useAppDispatch } from "@/redux/hooks";
import type { ApiResponse } from "@/types";
import type { Grade, Hashtag, SelectOption } from "@/types/common";
import type { Student, StudentsResponse } from "@/types/student";
import Clear from "@mui/icons-material/Clear";
import {
    Autocomplete,
    Input,
    Pagination,
    TextField,
    Tooltip,
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
} from "@mui/material";
import { Search } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import StudentDataGrid from "./datatable";

type StudentContentProps = Partial<{
    students: ApiResponse<StudentsResponse[]>;
    grades: Grade[];
    hashtags: Hashtag[];
    events: SelectOption[];
}>;

type Skill = {
    label: string;
    color: string;
};

export default function StudentContent({
    students,
    grades,
    hashtags,
    events,
}: StudentContentProps) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [inputValue, setInputValue] = useState(STRING_EMPTY);
    const [rows, setRows] = useState<StudentsResponse[]>(students!?.data!);
    const [searchCondition, setSearchCondition] = useState<Student>({
        event: DEFAULT_EVENT_OPTION,
        grade: DEFAULT_GRADE_NAME_OPTION,
    });

    function handleInputChange(
        event: SyntheticEvent,
        _value: string | { label: string; value: string } | null,
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
        _value: NonNullable<string | { label: string; id: number }>,
        reason: AutocompleteChangeReason
    ): void {
        event?.preventDefault();
        if (
            typeof _value === "string" &&
            !skills.find(x => x.label === _value.trim())
        ) {
            const hashtag = hashtags!?.find(x => x.name === _value);
            setSkills([
                ...skills,
                { label: hashtag?.name!, color: hashtag?.color! },
            ]);
        }

        if (
            typeof _value === "object" &&
            !skills.find(x => x.label === _value.label)
        ) {
            const hashtag = hashtags!?.find(x => x.id === _value.id);
            setSkills([
                ...skills,
                { label: hashtag?.name!, color: hashtag?.color! },
            ]);
        }

        if (reason === "selectOption" && open) {
            setOpen(false);
            if (inputValue !== STRING_EMPTY) setInputValue(STRING_EMPTY);
        }
    }

    async function handleSearch(event: SyntheticEvent) {
        event?.preventDefault();
        await dispatch(showLoading());
        try {
            let request: Student = {};
            if (searchCondition.grade !== DEFAULT_GRADE_NAME_OPTION) {
                request.grade = searchCondition.grade;
            }

            if (searchCondition.event !== DEFAULT_EVENT_OPTION) {
                request.event = searchCondition.event;
            }

            const searchParams = {
                ...request,
                hashtags: skills.map(skill => skill.label),
                name: searchCondition.name,
            };

            const students = await getStudents(searchParams);
            setRows(students?.data ?? []);
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
                    placeholder={json.common.student_name}
                    className="w-56"
                    sx={{ bgcolor: "#ffffff", paddingX: 1 }}
                    name="name"
                    onChange={e =>
                        setSearchCondition(x => ({
                            ...x,
                            [e.target.name]: e.target.value,
                        }))
                    }
                />

                {/* クラス名 */}

                <Select
                    name="event"
                    value={searchCondition.grade}
                    onValueChange={value =>
                        setSearchCondition(x => ({
                            ...x,
                            event: value,
                        }))
                    }
                >
                    <SelectTrigger>
                        <Label>{json.common.event}</Label>
                    </SelectTrigger>
                    <SelectContent>
                        {events?.map(x => (
                            <SelectItem value={x.name}>{x.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* イベント */}
                <Select
                    name="grade"
                    value={searchCondition.grade}
                    onValueChange={value =>
                        setSearchCondition(x => ({
                            ...x,
                            grade: value,
                        }))
                    }
                >
                    <SelectTrigger>
                        <Label>{json.common.grade}</Label>
                    </SelectTrigger>
                    <SelectContent>
                        {grades?.map(x => (
                            <SelectItem value={x.name}>{x.name}</SelectItem>
                        ))}
                    </SelectContent>
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
                    options={hashtags!?.map(x => ({
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
                <Tooltip title={json.common.search}>
                    <button
                        className="border-none outline-none flex items-center justify-center cursor-pointer"
                        onClick={handleSearch}
                    >
                        <Search className="text-icon-default" size={32} />
                    </button>
                </Tooltip>
            </div>
            <div className="w-full px-12 flex gap-x-2 flex-wrap">
                {skills.map((skill, index) => (
                    <ColorHashtag
                        key={`skill#${index}`}
                        onRemove={() => handleRemoveHashtag(index)}
                        index={index}
                        color={skill.color}
                    >
                        {skill.label}
                    </ColorHashtag>
                ))}
            </div>
            <hr className="border-table" />
            <StudentDataGrid rows={rows} />
            <div className="w-full flex justify-end items-center pr-12">
                <Pagination
                    count={students?.pagination!?.totalPages}
                    variant="outlined"
                    shape="rounded"
                />
            </div>
        </>
    );
}
