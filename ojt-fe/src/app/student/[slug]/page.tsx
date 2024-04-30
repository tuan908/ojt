"use client";

import {getGrades, type GradeDto} from "@/app/actions/common";
import {getEventDetailList} from "@/app/actions/event";
import {getEventsByStudentCodeWithQuery} from "@/app/actions/student";
import LoadingComponent from "@/components/LoadingComponent";
import PageWrapper from "@/components/PageWrapper";
import {
    EventStatus,
    ITEM_HEIGHT,
    ITEM_PADDING_TOP,
    ScreenMode,
    UserRole,
} from "@/constants";
import {useAuth} from "@/lib/hooks/useAuth";
import {getEventListByStudentCode} from "@/lib/redux/api/studentApi";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import {
    getLoadingState,
    hideLoading,
    showLoading,
} from "@/lib/redux/slice/loadingSlice";
import {type EventDto} from "@/types/event.types";
import {type StudentResponseDto} from "@/types/student.types";
import AddCircle from "@mui/icons-material/AddCircle";
import Search from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState, type ChangeEventHandler} from "react";
import {Checkbox} from "./_Checkbox";
import {EventGrid} from "./_EventGrid";

type CheckboxState = {
    unconfirmed: boolean;
    under_reviewing: boolean;
    confirmed: boolean;
    [x: string]: boolean;
};

type Option = {
    gradeList: GradeDto[];
    eventList: EventDto[];
};

export default function Page({params}: {params: {slug: string}}) {
    const {auth} = useAuth();
    const router = useRouter();
    const appDispatch = useAppDispatch();
    const isAppLoading = useAppSelector(getLoadingState);
    const [data, setData] = useState<StudentResponseDto | undefined>();
    const [isFetching, setIsFetching] = useState(false);
    const [check, setCheck] = useState<CheckboxState>({
        unconfirmed: false,
        under_reviewing: false,
        confirmed: false,
    });

    const [options, setOptions] = useState<Option>({
        gradeList: [],
        eventList: [],
    });
    const [grade, setGrade] = useState("");
    const [eventName, setName] = useState("");

    const init = async () => {
        await appDispatch(showLoading());
        const promises = [getGrades(), getEventDetailList()];
        const promiseResults = await Promise.allSettled(promises);

        if (promiseResults[0].status === "fulfilled") {
            let gradeList = promiseResults[0].value ?? [];
            setOptions(x => ({...x, gradeList}));
        }

        if (promiseResults[1].status === "fulfilled") {
            let eventList = promiseResults[1].value ?? [];
            setOptions(x => ({...x, eventList}));
        }

        appDispatch(getEventListByStudentCode.initiate(params.slug))
            .unwrap()
            .then(res => setData(res));

        await appDispatch(hideLoading());
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
        setCheck({...check, [event.target.name]: !check[event.target.name]});
    };

    function handleSearch() {
        setIsFetching(true);

        let status: EventStatus[] = [];
        if (check.unconfirmed) {
            status.push(EventStatus.UNCONFIRMED);
        }

        if (check.under_reviewing) {
            status.push(EventStatus.UNDER_REVIEWING);
        }

        if (check.confirmed) {
            status.push(EventStatus.CONFIRMED);
        }

        const promise = getEventsByStudentCodeWithQuery(params.slug, {
            grade,
            eventName,
            status,
        });

        promise
            .then(responseData => {
                setData(x => {
                    return {...x, events: responseData};
                });
            })
            .catch(error => {
                throw new Error(error?.message);
            })
            .finally(() => {
                let url = new URL(
                    `student/${params.slug}`,
                    process.env["NEXT_PUBLIC_URL"]
                );

                if (grade !== "") {
                    url.searchParams.append("grade", grade);
                }

                if (eventName !== "") {
                    url.searchParams.append("event", eventName);
                }

                if (status.length > 0) {
                    url.searchParams.append(
                        "status",
                        status.map(x => x.toString()).join(",")
                    );
                }
                router.push(url.toString());
                setIsFetching(false);
            });
    }

    return (
        <div className="flex flex-col w-full h-full m-auto">
            {auth && auth?.role === UserRole.Student ? (
                <div className="w-24/25 m-auto flex items-center pb-3">
                    <Link
                        href={`/event?mode=${ScreenMode.NEW}`}
                        className="flex gap-x-2 items-center px-6 py-2 bg-[#33b5e5] text-white rounded-lg"
                    >
                        <AddCircle />
                        <span>Add Event</span>
                    </Link>
                </div>
            ) : null}
            <PageWrapper>
                {isFetching || isAppLoading ? <LoadingComponent /> : null}

                {/* Student Info */}
                <>
                    {auth && auth.role !== UserRole.Student ? (
                        <>
                            <div className="border-b px-8 py-4 flex gap-x-12">
                                <span>{data?.name}</span>
                                <span>{data?.code}</span>
                                <span>{data?.grade}</span>
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
                            onChange={e => setGrade(e.target.value)}
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
                            {options.gradeList.map(x => (
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

                        {/* Event */}
                        <Select
                            variant="standard"
                            className="w-48"
                            defaultValue="Event"
                            onChange={e => setName(e.target.value)}
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
                            {options.eventList.map(x => (
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
                                label="UnderReviewing"
                                name="under_reviewing"
                                checked={check.under_reviewing}
                                handleChange={handleChange}
                            />

                            {/* Finished checkbox*/}
                            <Checkbox
                                label="Finished"
                                name="confirmed"
                                checked={check.confirmed}
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
                    <EventGrid
                        data={data?.events!}
                        studentId={data?.id}
                        code={params.slug}
                    />
                </div>
            </PageWrapper>
        </div>
    );
}
