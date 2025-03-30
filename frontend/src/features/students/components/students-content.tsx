"use client";

import { getStudents } from "@/app/actions/students";
import ColorHashtag from "@/features/students/components/color-hashtag";
import LegacySelect from "@/shared/components/legacy/select";
import {
    DEFAULT_EVENT_OPTION,
    DEFAULT_GRADE_NAME_OPTION,
    STRING_EMPTY,
} from "@/shared/constants";
import json from "@/shared/i18n/locales/ja.json";
import { hideLoading, showLoading } from "@/shared/redux/features/loadingSlice";
import { useAppDispatch } from "@/shared/redux/hooks";
import type {
    ApiResponse,
    Grade,
    Hashtag,
    IEvent,
    Student,
    Students,
} from "@/shared/types";
import Clear from "@mui/icons-material/Clear";
import {
    Autocomplete,
    Input,
    TextField,
    Tooltip,
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason
} from "@mui/material";
import { Search } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import StudentDataGrid from "./students-datatable";

type StudentContentProps = Partial<{
    rows: ApiResponse<Students[]>;
    grades: Grade[];
    hashtags: Hashtag[];
    events: IEvent[];
}>;

type Skill = {
    label: string;
    color: string;
};

export default function StudentContent({
    rows,
    grades,
    hashtags,
    events,
}: StudentContentProps) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [inputValue, setInputValue] = useState(STRING_EMPTY);
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
                hashtags: skills.map(skill => skill.label).join(","),
                name: searchCondition.name,
            };

            const students = await getStudents(searchParams);
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
            <div className="px-8 pt-4 flex flex-col items-center gap-y-2 md:gap-x-8 md:flex-row">
                {/* 学生の名前 */}
                <Input
                    placeholder={json.common.studentName}
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
                <LegacySelect
                    name="grade"
                    value={searchCondition.grade}
                    onChange={event =>
                        setSearchCondition(x => ({
                            ...x,
                            grade: event.target.value,
                        }))
                    }
                    label={DEFAULT_GRADE_NAME_OPTION}
                    options={grades ?? []}
                />

                {/* イベント */}
                <LegacySelect
                    value={searchCondition.event}
                    onChange={event =>
                        setSearchCondition(x => ({
                            ...x,
                            event: event.target.value,
                        }))
                    }
                    label={DEFAULT_EVENT_OPTION}
                    options={events ?? []}
                />

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
                    slotProps={{
                        chip: {
                            sx: {
                                bgcolor: "transparent",
                            },
                            clickable: false,
                            deleteIcon: <Clear />,
                        },
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
            <StudentDataGrid rows={rows?.data ?? []} />
        </>
    );
}
