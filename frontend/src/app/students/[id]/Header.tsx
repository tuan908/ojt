"use client";

import { addEvent } from "@/app/actions/event.action";
import { FormItem } from "@/components/Form/FormItem";
import SubmitButton from "@/components/Form/SubmitButton";
import { type SelectOption } from "@/components/Select";
import { menuProps, UserRole } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import json from "@/i18n/jp.json";
import { StatusCode } from "@/types";
import Close from "@mui/icons-material/Close";
import { MenuItem, Modal, Select } from "@mui/material";
import { useActionState, useEffect, useState } from "react";
import AddEventButton from "./AddEventButton";

interface HeaderProps {
    eventOptions: SelectOption[];
    code: string;
}

export default function Header(props: HeaderProps) {
    const [open, setOpen] = useState(false);
    const [state, action, isSubmitting] = useActionState(addEvent, null);
    const { auth } = useAuth();

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        if (!open) return;
        setOpen(false);
    };

    useEffect(() => {
        if (state?.code === StatusCode.Success) {
            setOpen(false);
        }
    }, [state?.code]);

    return (
        <div className="w-24/25 m-auto flex items-center pb-3">
            <AddEventButton
                hide={auth?.role !== UserRole.Student}
                onClick={handleOpen}
            />
            <Modal
                open={open}
                onClose={handleClose}
                className="flex items-center justify-center"
            >
                <div className="lg:w-[900px] h-5/6 bg-white flex flex-col rounded-lg relative">
                    <div className="w-11/12 m-auto flex justify-between items-center">
                        <span className="w-full text-3xl text-center">
                            新規作成
                        </span>
                        <button type="button" onClick={handleClose}>
                            <Close
                                fontSize="large"
                                className="absolute right-4 top-4"
                            />
                        </button>
                    </div>
                    <form
                        className="w-4/5 flex flex-col gap-y-3 m-auto p-4"
                        action={action}
                    >
                        <label htmlFor="selectEvent">
                            {json.event.select_event}
                        </label>
                        <Select
                            name="eventName"
                            variant="outlined"
                            className="w-full border-default disabled:cursor-not-allowed"
                            placeholder={json.event.select_event}
                            sx={{ backgroundColor: "#ffffff", paddingX: 1 }}
                            MenuProps={menuProps}
                            disabled={isSubmitting}
                            defaultValue={json.event.placeholder_0}
                        >
                            <MenuItem value={json.event.placeholder_0}>
                                {json.event.placeholder_0}
                            </MenuItem>
                            {props.eventOptions!?.map(option => (
                                <MenuItem key={option.id} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {state?.error?.event && (
                            <span className="text-sm text-red-500">
                                {state?.error?.event}
                            </span>
                        )}

                        {/* Events in school life */}
                        <FormItem
                            name="eventsInSchoolLife"
                            label={json.event.question_1}
                            inputPlaceholder={json.event.placeholder_1}
                            disabled={isSubmitting}
                        />

                        {/* My Actions */}
                        <FormItem
                            name="myAction"
                            label={json.event.question_2}
                            inputPlaceholder={json.event.placeholder_2}
                            disabled={isSubmitting}
                        />

                        {/* Shown power */}
                        <FormItem
                            name="shownPower"
                            label={json.event.question_3}
                            inputPlaceholder={json.event.placeholder_3}
                            disabled={isSubmitting}
                        />

                        {/* Strength that has grown */}
                        <FormItem
                            name="strengthGrown"
                            label={json.event.question_4}
                            inputPlaceholder={json.event.placeholder_4}
                            disabled={isSubmitting}
                        />

                        {/* What I thought */}
                        <FormItem
                            name="myThought"
                            label={json.event.question_5}
                            inputPlaceholder={json.event.placeholder_5}
                            disabled={isSubmitting}
                        />
                        <SubmitButton />
                    </form>
                </div>
            </Modal>
        </div>
    );
}
