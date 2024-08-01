"use client";

import type {Grade, Hashtag} from "@/types/common-action.types";
import {getStudents} from "@/app/actions/student.action";
import ColorHashtag from "@/components/ColorHashtag";
import Select, {type SelectOption} from "@/components/Select";
import {
    DEFAULT_EVENT_OPTION,
    DEFAULT_GRADE_NAME_OPTION,
    STRING_EMPTY,
} from "@/constants";
import json from "@/i18n/jp.json";
import {hideLoading, showLoading} from "@/redux/features/loading/loading.slice";
import {useAppDispatch} from "@/redux/hooks";
import type {Page, StudentsRequest, StudentsResponse} from "@/types/student";
import Clear from "@mui/icons-material/Clear";
import Search from "@mui/icons-material/Search";
import {
    Autocomplete,
    Input,
    Pagination,
    TextField,
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
} from "@mui/material";
import {useState, type SyntheticEvent} from "react";
import StudentDataGrid from "./_StudentDataGrid";

type SearchAreaProps = Partial<{
    students: Page<StudentsResponse>;
    grades: Grade[];
    hashtags: Hashtag[];
    events: SelectOption[];
}>;

type Skill = {
    label: string;
    color: string;
};

export default function SearchArea({
    students,
    grades,
    hashtags,
    events,
}: SearchAreaProps) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [inputValue, setInputValue] = useState(STRING_EMPTY);
    const [rows, setRows] = useState<StudentsResponse[]>(students?.content!);
    const [searchCondition, setSearchCondition] = useState<StudentsRequest>({
        events: DEFAULT_EVENT_OPTION,
        grade: DEFAULT_GRADE_NAME_OPTION,
    });

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
            const hashtag = hashtags!?.find(x => x.name === _value);
            setSkills([
                ...skills,
                {label: hashtag?.name!, color: hashtag?.color!},
            ]);
        }

        if (
            typeof _value === "object" &&
            !skills.find(x => x.label === _value.label)
        ) {
            const hashtag = hashtags!?.find(x => x.id === _value.id);
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

    async function handleSearch(event: SyntheticEvent) {
        event?.preventDefault();
        await dispatch(showLoading());
        try {
            let request: StudentsRequest = {};
            if (searchCondition.grade !== DEFAULT_GRADE_NAME_OPTION) {
                request.grade = searchCondition.grade;
            }

            if (searchCondition.events !== DEFAULT_EVENT_OPTION) {
                request.events = searchCondition.events;
            }

            const searchParams = {
                ...request,
                hashtags: skills.map(skill => skill.label),
                name: searchCondition.name,
            };

            const students = await getStudents(searchParams);
            setRows(students!?.content);
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
                    sx={{bgcolor: "#ffffff", paddingX: 1}}
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
                    name="grade"
                    defaultOption={json.common.grade}
                    value={searchCondition.grade}
                    options={grades!}
                    onChange={e =>
                        setSearchCondition(x => ({
                            ...x,
                            grade: e.target.value as string,
                        }))
                    }
                />

                {/* イベント */}
                <Select
                    name="event"
                    defaultOption={json.common.event}
                    value={searchCondition.events}
                    options={events!}
                    onChange={e =>
                        setSearchCondition(x => ({
                            ...x,
                            events: e.target.value as string,
                        }))
                    }
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
                    count={students?.page?.totalPage}
                    variant="outlined"
                    shape="rounded"
                />
            </div>
        </>
    );
}
