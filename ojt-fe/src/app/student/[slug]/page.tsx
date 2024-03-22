"use client";

import LoadingComponent from "@/components/LoadingComponent";
import PageWrapper from "@/components/PageWrapper";
import {ITEM_HEIGHT, ITEM_PADDING_TOP, UserRole} from "@/constants";
import {useAuth} from "@/lib/hooks/useAuth";
import {type StudentResponseDto} from "@/types/student.types";
import AddCircle from "@mui/icons-material/AddCircle";
import Search from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Link from "next/link";
import {
    useEffect,
    useState,
    type ChangeEventHandler,
    type SyntheticEvent,
} from "react";
import {Checkbox} from "./_Checkbox";
import {EventGrid} from "./_EventGrid";

type CheckboxState = {[x: string]: boolean};

export default function Page({params}: {params: {slug: string}}) {
    const [auth] = useAuth();
    const [response, setData] = useState<{
        data: StudentResponseDto | null;
        errors: unknown[];
        isFetching: boolean;
    }>({data: null, errors: [], isFetching: true});
    const [check, setCheck] = useState<CheckboxState>({
        unconfirmed: false,
        confirmed: false,
        finished: false,
    });

    async function getStudentDetailByCode() {
        const res = await fetch(
            `${process.env["NEXT_PUBLIC_URL"]}/api/student/${params.slug}`
        );
        const body = (await res.json()) as {
            data: StudentResponseDto | null;
            errors: unknown[];
        };
        setData({...body, isFetching: false});
    }

    useEffect(() => {
        getStudentDetailByCode();
    }, []);

    const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
        setCheck({...check, [event.target.name]: !check[event.target.name]});
    };

    function handleSearch(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
    ): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="flex flex-col w-full h-full m-auto">
            {auth && auth?.role === UserRole.Student ? (
                <div className="w-24/25 m-auto flex items-center pb-3">
                    <Link
                        href="/event?mode=new"
                        className="flex gap-x-2 items-center px-6 py-2 bg-[#33b5e5] text-white rounded-lg"
                    >
                        <AddCircle />
                        <span>Add Event</span>
                    </Link>
                </div>
            ) : null}
            <PageWrapper>
                {response.isFetching ? <LoadingComponent /> : null}

                {/* Student Info */}
                <>
                    {auth && auth.role !== UserRole.Student ? (
                        <>
                            <div className="border-b px-8 py-4 flex gap-x-12">
                                <span>{response.data?.name}</span>
                                <span>{response?.data?.code}</span>
                                <span>{response?.data?.grade}</span>
                            </div>
                        </>
                    ) : null}

                    {/* ?? */}
                    <div className="border-b px-8 flex items-center py-4 gap-x-8">
                        {/* School's year */}
                        <Select
                            variant="standard"
                            className="w-48"
                            placeholder="School Year"
                            defaultValue="School Year"
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
                                                ITEM_HEIGHT * 4.5 +
                                                ITEM_PADDING_TOP,
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
                            className="w-48"
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
                                                ITEM_HEIGHT * 4.5 +
                                                ITEM_PADDING_TOP,
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

                        <div className="flex items-center gap-x-8">
                            <span>Status:</span>

                            {/* Unconfirmed checkbox */}
                            <Checkbox
                                label="Unconfirmed"
                                name="unconfirmed"
                                checked={check.unconfirmed}
                                handleChange={e => handleChange(e)}
                            />

                            {/* Confirmed checkbox */}
                            <Checkbox
                                label="Confirmed"
                                name="confirmed"
                                checked={check.confirmed}
                                handleChange={handleChange}
                            />

                            {/* Finished checkbox*/}
                            <Checkbox
                                label="Finished"
                                name="finished"
                                checked={check.finished}
                                handleChange={handleChange}
                            />
                        </div>
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
                </>

                {/* Table */}
                <div className="w-full px-10 pt-6">
                    <EventGrid data={response.data} />
                </div>
            </PageWrapper>
        </div>
    );
}
