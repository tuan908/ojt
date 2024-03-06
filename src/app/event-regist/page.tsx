"use client";

import {SubmitButton} from "@/components/SubmitButton";
import {ITEM_HEIGHT, ITEM_PADDING_TOP} from "@/constants";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {useFormState} from "react-dom";
import {registerStudentEvent} from "../actions/event";

export default function Page() {
    const [state, formAction] = useFormState(registerStudentEvent, undefined);
    return (
        <div className="w-1/2 m-auto bg-white rounded-xl shadow-2xl">
            <form
                action={formAction}
                className="w-[90%] m-auto flex flex-col gap-y-6 py-6"
            >
                {/* Select */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="selectEvent">Select Event:</label>
                    <Select
                        variant="outlined"
                        className="w-full border-default"
                        placeholder="Select Event"
                        defaultValue="Event"
                        sx={{bgcolor: "#ffffff", paddingX: 1}}
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
                </div>

                {/* Events in school life */}
                <textarea
                    className="resize-none border rounded-md px-4 py-2 outline-blue-500"
                    name="eventsInSchoolLife"
                    placeholder="Events in school life"
                    cols={30}
                    rows={2}
                />

                {/* My Actions */}
                <textarea
                    className="resize-none border rounded-md px-4 py-2 outline-blue-500"
                    name="myAction"
                    placeholder="My Actions"
                    cols={30}
                    rows={2}
                />

                {/* Shown power */}
                <textarea
                    className="resize-none border rounded-md px-4 py-2 outline-blue-500"
                    name="shownPower"
                    placeholder="Shown power"
                    cols={30}
                    rows={2}
                />

                {/* Strength that has grown */}
                <textarea
                    className="resize-none border rounded-md px-4 py-2 outline-blue-500"
                    name="strengthGrown"
                    placeholder="Strength that has grown"
                    cols={30}
                    rows={2}
                />

                {/* What I thought */}
                <textarea
                    className="resize-none border rounded-md px-4 py-2 outline-blue-500"
                    name="myThought"
                    placeholder="What I thought"
                    cols={30}
                    rows={2}
                />

                <SubmitButton backgroundColor="#4285f4" />
            </form>
        </div>
    );
}
