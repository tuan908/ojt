"use client";

import {getStudentList, type StudentDto} from "@/app/actions/student";
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
import Analytics from "@mui/icons-material/Analytics";
import Clear from "@mui/icons-material/Clear";
import Search from "@mui/icons-material/Search";
import Autocomplete, {
    type AutocompleteChangeReason,
    type AutocompleteInputChangeReason,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState, type SyntheticEvent} from "react";
import StudentDataGrid from "./_StudentDataGrid";

export default function Page() {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [rows, setList] = useState<StudentDto[]>([]);
    const isFetching = useAppSelector(getLoadingOrFetchingState);

    async function init() {
        await dispatch(showIsLoadingOrFetching());
        try {
            const data = await getStudentList();
            setList(data);
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
        if (typeof _value === "string" && !skills.includes(_value)) {
            setSkills([...skills, _value]);
        }

        if (typeof _value === "object" && !skills.includes(_value.label)) {
            setSkills([...skills, _value.label]);
        }

        if (reason === "selectOption" && open) {
            setOpen(false);
        }
    }

    async function handleSearch(event: SyntheticEvent) {
        event?.preventDefault();
        await dispatch(showIsLoadingOrFetching());
        try {
            const data = await getStudentList();
            setList(data);
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
                />

                {/* School's year */}
                <Select
                    variant="standard"
                    className="w-56"
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
                        <MenuItem
                            key={x}
                            value={x}
                            disableRipple
                            disableTouchRipple
                        >
                            Year {x}
                        </MenuItem>
                    ))}
                </Select>

                {/* Event */}
                <Select
                    variant="standard"
                    className="w-56"
                    defaultValue="Event"
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
                    <MenuItem value="Event">Event</MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => (
                        <MenuItem
                            key={x}
                            value={x}
                            disableRipple
                            disableTouchRipple
                        >
                            Event {x}
                        </MenuItem>
                    ))}
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
                    options={[
                        {label: "#independence", id: "0"},
                        {label: "#ability to quickly grasp", id: "1"},
                        {label: "#discipline", id: "2"},
                    ]}
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
                        color="#fb706c"
                    >
                        {skill}
                    </ColorHashtag>
                ))}
            </div>

            <hr className="border-table" />

            <StudentDataGrid rows={rows} />
            {/*  */}
        </PageWrapper>
    );
}
