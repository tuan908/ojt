"use client";

import {
    EventDto,
    HashtagDto,
    StudentListRequestDto,
    getEventList,
    getStudentList,
    type StudentDto,
} from "@/app/actions/student";
import {GradeDto, getGradeList, getHashtagList} from "@/app/actions/tracking";
import ColorHashtag from "@/components/ColorHashtag";
import LoadingComponent from "@/components/LoadingComponent";
import PageWrapper from "@/components/PageWrapper";
import {ITEM_HEIGHT, ITEM_PADDING_TOP} from "@/constants";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import {
    getLoadingOrFetchingState,
    hideIsLoadingOrFetching,
    showIsLoadingOrFetching,
} from "@/lib/redux/slice/loadingSlice";
import {MaybeNull} from "@/types";
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
import {useEffect, useState, type SyntheticEvent} from "react";
import StudentDataGrid from "./_StudentDataGrid";

type DropdownOption = MaybeNull<{
    grade: GradeDto[];
    event: EventDto[];
    hashtag: HashtagDto[];
}>;

export default function Page() {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<Array<{label: string; color: string}>>(
        []
    );
    const [inputValue, setInputValue] = useState("");
    const [rows, setRows] = useState<StudentDto[]>([]);
    const [searchOptions, setOptions] = useState<DropdownOption>({
        event: null,
        grade: null,
        hashtag: null,
    });
    const isFetching = useAppSelector(getLoadingOrFetchingState);
    const [searchCondition, setCondition] = useState<StudentListRequestDto>({});

    async function init() {
        await dispatch(showIsLoadingOrFetching());
        try {
            const promises = await Promise.allSettled([
                getGradeList(),
                getEventList(),
                getHashtagList(),
                getStudentList(),
            ]);

            if (promises[0].status === "fulfilled") {
                const grade = promises[0].value;
                setOptions(x => ({...x, grade}));
            }

            if (promises[1].status === "fulfilled") {
                const event = promises[1].value;
                setOptions(x => ({...x, event}));
            }

            if (promises[2].status === "fulfilled") {
                const hashtag = promises[2].value;
                setOptions(x => ({...x, hashtag}));
            }

            if (promises[3].status === "fulfilled") {
                const data = promises[3].value;
                setRows(data);
            }
        } catch (error: any) {
            throw new Error(error?.message);
        }

        await dispatch(hideIsLoadingOrFetching());
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
        _value: NonNullable<string | {label: string; id: string}>,
        reason: AutocompleteChangeReason
    ): void {
        event?.preventDefault();
        if (
            typeof _value === "string" &&
            !skills.find(x => x.label === _value)
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
        }

        setCondition(x => ({
            ...x,
            hashtags: skills.map(skill => skill.label).join(","),
        }));
    }

    async function handleSearch(event: SyntheticEvent) {
        event?.preventDefault();
        await dispatch(showIsLoadingOrFetching());
        try {
            let request: StudentListRequestDto = {};
            if (searchCondition.schoolYear !== "All Grade") {
                request.schoolYear = searchCondition.schoolYear;
            }

            if (searchCondition.events !== "All Event") {
                request.events = searchCondition.events;
            }

            const data = await getStudentList({
                ...request,
                hashtags: searchCondition.hashtags,
                studentName: searchCondition.studentName,
            });
            setRows(data);
        } catch (error: any) {
            throw new Error(error?.message);
        }

        await dispatch(hideIsLoadingOrFetching());
    }

    function handleRemoveHashtag(_index: number): void {
        setSkills(skills.filter((_, index) => index !== _index));
    }

    return (
        <PageWrapper gapY>
            {isFetching ? <LoadingComponent /> : null}
            {/* Student info */}
            <div className="w-full pl-12 pt-8 flex gap-x-8">
                {/* Student name */}
                <Input
                    placeholder="Student Name"
                    className="w-56"
                    sx={{bgcolor: "#ffffff", paddingX: 1}}
                    name="studentName"
                    onChange={e =>
                        setCondition(x => ({
                            ...x,
                            [e.target.name]: e.target.value,
                        }))
                    }
                />

                {/* School's year */}
                <Select
                    variant="standard"
                    className="w-56"
                    defaultValue="All Grade"
                    name="schoolYear"
                    onChange={e =>
                        setCondition(x => ({...x, schoolYear: e.target.value}))
                    }
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
                    <MenuItem value="All Grade">All Grade</MenuItem>
                    {searchOptions.grade
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

                {/* Event */}
                <Select
                    variant="standard"
                    className="w-56"
                    name="event"
                    defaultValue="All Event"
                    onChange={e =>
                        setCondition(x => ({...x, events: e.target.value}))
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
                    <MenuItem value="All Event">All Event</MenuItem>
                    {searchOptions.event
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

                {/* Hashtag */}
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
                        searchOptions.hashtag
                            ? searchOptions.hashtag.map(x => ({
                                  id: x.id,
                                  label: x.name,
                              }))
                            : []
                    }
                    renderInput={params => (
                        <TextField
                            {...params}
                            placeholder="#Hashtag"
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
            {/*  */}
        </PageWrapper>
    );
}