"use client";

import {
    getEvents,
    getGrades,
    getHashtags,
    type GradeDto,
} from "@/app/actions/common";
import {getStudents} from "@/app/actions/student";
import OjtColorHashtag from "@/components/ColorHashtag";
import ProgressIndicator from "@/components/ProgressIndicator";
import PageWrapper from "@/components/PageWrapper";
import {ITEM_HEIGHT, ITEM_PADDING_TOP, STRING_EMPTY} from "@/constants";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import {
    getLoadingState,
    hideLoading,
    showLoading,
} from "@/lib/redux/slice/loading.slice";
import type {
    EventDetailDto,
    HashtagDto,
    StudentListRequestDto,
    StudentResponseDto,
} from "@/types/student.types";
import Clear from "@mui/icons-material/Clear";
import Search from "@mui/icons-material/Search";
import Autocomplete, {
    AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {useEffect, useOptimistic, useState, type SyntheticEvent} from "react";
import StudentDataGrid from "./_StudentDataGrid";

type DropdownOption = Partial<{
    grade: GradeDto[];
    event: EventDetailDto[];
    hashtag: HashtagDto[];
}>;

export default function Page() {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<Array<{label: string; color: string}>>(
        []
    );
    const [inputValue, setInputValue] = useState("");
    const [rows, setRows] = useState<StudentResponseDto[]>([]);
    const [searchOptions, setOptions] = useState<DropdownOption>();
    const isFetching = useAppSelector(getLoadingState);
    const [searchCondition, setCondition] = useState<StudentListRequestDto>({});

    async function init() {
        await dispatch(showLoading());
        try {
            const [
                gradesPromise,
                eventsPromise,
                hashtagsPromise,
                studentsPromises,
            ] = await Promise.allSettled([
                getGrades(),
                getEvents(),
                getHashtags(),
                getStudents(),
            ]);

            if (gradesPromise.status === "fulfilled") {
                const grade = gradesPromise.value;
                setOptions(x => ({...x, grade}));
            }

            if (eventsPromise.status === "fulfilled") {
                const event = eventsPromise.value;
                setOptions(x => ({...x, event}));
            }

            if (hashtagsPromise.status === "fulfilled") {
                const hashtag = hashtagsPromise.value;
                setOptions(x => ({...x, hashtag}));
            }

            if (studentsPromises.status === "fulfilled") {
                const students = studentsPromises.value;
                setRows(students?.content!);
            }
        } catch (error: any) {
            throw new Error(error?.message);
        }

        await dispatch(hideLoading());
    }

    useEffect(() => {
        init();
    }, []);

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
            const hashtag = searchOptions?.hashtag?.find(
                x => x.name === _value
            );
            setSkills([
                ...skills,
                {label: hashtag?.name!, color: hashtag?.color!},
            ]);
        }

        if (
            typeof _value === "object" &&
            !skills.find(x => x.label === _value.label)
        ) {
            const hashtag = searchOptions?.hashtag?.find(
                x => x.id === _value.id
            );
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
            let request: StudentListRequestDto = {};
            if (searchCondition.grade !== "クラス名") {
                request.grade = searchCondition.grade;
            }

            if (searchCondition.events !== "イベント") {
                request.events = searchCondition.events;
            }

            const searchDto = {
                ...request,
                hashtags: searchCondition.hashtags,
                name: searchCondition.name,
            };

            const students = await getStudents(searchDto);
            setRows(students?.content!);
        } catch (error: any) {
            throw new Error(error?.message);
        }

        await dispatch(hideLoading());
    }

    function handleRemoveHashtag(_index: number): void {
        setSkills(skills.filter((_, index) => index !== _index));
    }

    return (
        <PageWrapper gapY>
            {isFetching ? <ProgressIndicator /> : null}
            {/* Student info */}
            <div className="w-full pl-12 pt-8 flex gap-x-8">
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
                    {searchOptions!?.grade
                        ? searchOptions.grade.map(x => (
                              <MenuItem
                                  key={x.id}
                                  value={x.name}
                                  disableRipple
                                  disableTouchRipple
                              >
                                  {x.name}
                              </MenuItem>
                          ))
                        : []}
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
                    {searchOptions!?.event
                        ? searchOptions.event.map(x => (
                              <MenuItem
                                  key={x.id}
                                  value={x.name}
                                  disableRipple
                                  disableTouchRipple
                              >
                                  {x.name}
                              </MenuItem>
                          ))
                        : []}
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
                    options={
                        searchOptions!?.hashtag
                            ? [...searchOptions.hashtag].map(x => ({
                                  id: x.id,
                                  label: x.name,
                              }))
                            : []
                    }
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
            {/*  */}
        </PageWrapper>
    );
}
