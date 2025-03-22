"use client";

import { getEventsByStudentCodeWithQuery } from "@/app/actions/student";
import { Checkbox } from "@/components/ui/legacy/checkbox";
import Select from "@/components/ui/legacy/select";
import {
    DEFAULT_EVENT_OPTION,
    DEFAULT_GRADE_NAME_OPTION,
    EventStatus,
} from "@/constants";
import json from "@/i18n/locales/ja.json";
import { JwtPayload } from "@/lib/session";
import type { Grade, SelectOption } from "@/types/common";
import { StudentEvent } from "@/types/student";
import { Tooltip } from "@mui/material";
import { type SelectChangeEvent } from "@mui/material/Select";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    startTransition,
    useState,
    type ChangeEventHandler,
    type ReactNode,
} from "react";
import StudentEventsDatatable from "./datatable";

type SearchAreaProps = {
    id: string;
    grades?: Grade[];
    events?: SelectOption[];
    data: StudentEvent;
    auth: JwtPayload | undefined;
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

export default function StudentDetailContent({
    data,
    id,
    events,
    grades,
    auth,
}: SearchAreaProps) {
    const router = useRouter();
    const [check, setCheck] = useState<CheckboxState>({
        unconfirmed: false,
        under_reviewing: false,
        confirmed: false,
    });
    const [grade, setGrade] = useState(DEFAULT_GRADE_NAME_OPTION);
    const [eventName, setEventName] = useState(DEFAULT_EVENT_OPTION);

    const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
        setCheck({ ...check, [event.target.name]: !check[event.target.name] });
    };

    async function handleSearch() {
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

        try {
            await getEventsByStudentCodeWithQuery(id, {
                grade: grade === DEFAULT_GRADE_NAME_OPTION ? undefined : grade,
                eventName:
                    eventName === DEFAULT_EVENT_OPTION ? undefined : eventName,
                status,
            });
            let url = new URL(window.location.href);
            url.searchParams.forEach((value, key) => {
                url.searchParams.delete(key, value);
            });

            if (grade.length > 0 && grade !== DEFAULT_GRADE_NAME_OPTION) {
                url.searchParams.set("grade", grade);
            }

            if (eventName.length > 0 && eventName !== DEFAULT_EVENT_OPTION) {
                url.searchParams.set("event", eventName);
            }

            if (status.length > 0) {
                url.searchParams.set(
                    "status",
                    status.map(x => x.toString()).join(",")
                );
            }
            startTransition(() => {
                router.push(url.toString());
            });
        } catch (error) {
            console.error(error);
        }
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
            <div className="border-b md:px-8 px-4 flex flex-col gap-y-4 md:flex-row md:items-center py-4 md:gap-x-8">
                {/* クラス名 */}
                <Select
                    defaultOption={DEFAULT_GRADE_NAME_OPTION}
                    options={grades!}
                    value={grade}
                    onChange={handleSelectGrade}
                />

                {/* イベント */}
                <Select
                    defaultOption={DEFAULT_EVENT_OPTION}
                    options={events!}
                    value={eventName}
                    onChange={handleSelectEvent}
                />

                <div className="flex flex-col items-center md:flex-row md:gap-x-8">
                    <span>ステータス：</span>

                    {/* 未確認 */}
                    <Checkbox
                        label={json.status.unconfirmed}
                        name="unconfirmed"
                        checked={check.unconfirmed}
                        handleChange={e => handleChange(e)}
                    />

                    {/* 確認中 */}
                    <Checkbox
                        label={json.status.under_reviewing}
                        name="under_reviewing"
                        checked={check.under_reviewing}
                        handleChange={handleChange}
                    />

                    {/* 修了*/}
                    <Checkbox
                        label={json.status.confirmed}
                        name="confirmed"
                        checked={check.confirmed}
                        handleChange={handleChange}
                    />
                </div>
                <Tooltip title={json.common.search}>
                    <button
                        className="border-none outline-none flex items-center justify-center cursor-pointer"
                        onClick={handleSearch}
                    >
                        <Search className="text-icon-default" size="1.5rem" />
                    </button>
                </Tooltip>
            </div>

            {/* Table */}
            <div className="w-full px-10 pt-6">
                <StudentEventsDatatable
                    rows={data.events}
                    studentId={data?.id}
                    code={id}
                    role={auth?.role!}
                    username={auth?.username}
                />
            </div>
        </>
    );
}
