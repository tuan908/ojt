"use client";

import {GradeDto} from "@/app/actions/common";
import {getEventsByStudentCodeWithQuery} from "@/app/actions/student";
import {OjtCheckbox} from "@/components/Checkbox";
import {ITEM_HEIGHT, ITEM_PADDING_TOP, OjtEventStatus} from "@/constants";
import {type EventDto} from "@/types/event.types";
import {StudentResponseDto} from "@/types/student.types";
import Search from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Select, {type SelectChangeEvent} from "@mui/material/Select";
import {useRouter} from "next/navigation";
import {useState, type ChangeEventHandler, type ReactNode} from "react";
import {EventGrid} from "./_EventGrid";

type SearchAreaProps = {
    params: {slug: string};
    grades?: GradeDto[];
    events?: EventDto[];
    data: StudentResponseDto;
};

type MuiSelectChangeHandler = (
    event: SelectChangeEvent<string>,
    reactNode: ReactNode
) => void;

type CheckboxState = {
    unconfirmed: boolean;
    under_reviewing: boolean;
    confirmed: boolean;
    [x: string]: boolean;
};

const CLASS_OPTION_DEFAULT = "クラス名";
const EVENT_OPTION_DEFAULT = "イベント";

export default function SearchArea(props: SearchAreaProps) {
    const router = useRouter();
    const [data, setData] = useState<StudentResponseDto | undefined>(
        props.data
    );
    const [check, setCheck] = useState<CheckboxState>({
        unconfirmed: false,
        under_reviewing: false,
        confirmed: false,
    });
    const [grade, setGrade] = useState(CLASS_OPTION_DEFAULT);
    const [eventName, setEventName] = useState(EVENT_OPTION_DEFAULT);

    const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
        setCheck({...check, [event.target.name]: !check[event.target.name]});
    };

    function handleSearch() {
        let status: OjtEventStatus[] = [];
        if (check.unconfirmed) {
            status.push(OjtEventStatus.UNCONFIRMED);
        }

        if (check.under_reviewing) {
            status.push(OjtEventStatus.UNDER_REVIEWING);
        }

        if (check.confirmed) {
            status.push(OjtEventStatus.CONFIRMED);
        }

        const promise = getEventsByStudentCodeWithQuery(props.params.slug, {
            grade: grade === CLASS_OPTION_DEFAULT ? undefined : grade,
            eventName:
                eventName === EVENT_OPTION_DEFAULT ? undefined : eventName,
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
                let url = new URL(window.location.href);
                url.searchParams.forEach((value, key) => {
                    url.searchParams.delete(key, value);
                });

                if (grade.length > 0 && grade !== CLASS_OPTION_DEFAULT) {
                    url.searchParams.set("grade", grade);
                }

                if (
                    eventName.length > 0 &&
                    eventName !== EVENT_OPTION_DEFAULT
                ) {
                    url.searchParams.set("event", eventName);
                }

                if (status.length > 0) {
                    url.searchParams.set(
                        "status",
                        status.map(x => x.toString()).join(",")
                    );
                }
                router.push(url.toString());
            });
    }

    const handleSelectGrade: MuiSelectChangeHandler = (event, _reactNode) => {
        event?.preventDefault();
        setGrade(event.target.value);
    };

    const handleSelectEvent: MuiSelectChangeHandler = (event, _reactNode) => {
        event?.preventDefault();
        setEventName(event.target.value);
    };

    return (
        <>
            <div className="border-b px-8 flex items-center py-4 gap-x-8">
                {/* クラス名 */}
                <Select
                    variant="standard"
                    className="w-48"
                    value={grade}
                    onChange={handleSelectGrade}
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
                    <MenuItem value={CLASS_OPTION_DEFAULT}>
                        {CLASS_OPTION_DEFAULT}
                    </MenuItem>
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
                    className="w-48"
                    value={eventName}
                    onChange={handleSelectEvent}
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
                    <MenuItem value={EVENT_OPTION_DEFAULT}>
                        {EVENT_OPTION_DEFAULT}
                    </MenuItem>
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

                <div className="flex items-center gap-x-8">
                    <span>ステータス：</span>

                    {/* 未確認 */}
                    <OjtCheckbox
                        label="未確認"
                        name="unconfirmed"
                        checked={check.unconfirmed}
                        handleChange={e => handleChange(e)}
                    />

                    {/* 確認中 */}
                    <OjtCheckbox
                        label="確認中"
                        name="under_reviewing"
                        checked={check.under_reviewing}
                        handleChange={handleChange}
                    />

                    {/* 修了*/}
                    <OjtCheckbox
                        label="修了"
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

            {/* Table */}
            <div className="w-full px-10 pt-6">
                <EventGrid
                    data={data?.events!}
                    studentId={data?.id}
                    code={props.params.slug}
                />
            </div>
        </>
    );
}
