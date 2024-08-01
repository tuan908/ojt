"use client";

import {addEvent} from "@/app/actions/event.action";
import {SelectOption} from "@/components/Select";
import Textarea from "@/components/Textarea";
import {menuProps} from "@/constants";
import json from "@/i18n/jp.json";
import AddCircle from "@mui/icons-material/AddCircle";
import Close from "@mui/icons-material/Close";
import {Button, CircularProgress, MenuItem, Modal, Select} from "@mui/material";
import {useActionState, useState} from "react";

export default function Header({eventOptions}: {eventOptions: SelectOption[]}) {
    const [open, setOpen] = useState(false);
    const [state, action, isSubmitting] = useActionState(addEvent, null);

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        if (!open) return;
        setOpen(false);
    };

    return (
        <div className="w-24/25 m-auto flex items-center pb-3">
            <button
                type="button"
                className="flex gap-x-2 items-center px-6 py-2 bg-[#33b5e5] text-white rounded-lg"
                onClick={handleOpen}
            >
                <AddCircle />
                <span>新規作成</span>
            </button>
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
                            sx={{backgroundColor: "#ffffff", paddingX: 1}}
                            MenuProps={menuProps}
                            disabled={isSubmitting}
                            defaultValue={json.event.placeholder_0}
                        >
                            <MenuItem value={json.event.placeholder_0}>
                                {json.event.placeholder_0}
                            </MenuItem>
                            {eventOptions!?.map(option => (
                                <MenuItem key={option.id} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <span className="text-sm text-red-500">
                            {state?.error?.event}
                        </span>

                        {/* Events in school life */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_1}
                            </label>
                            <Textarea
                                name="eventsInSchoolLife"
                                placeholder={json.event.placeholder_1}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* My Actions */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_2}
                            </label>
                            <Textarea
                                name="myAction"
                                placeholder={json.event.placeholder_2}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Shown power */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_3}
                            </label>
                            <Textarea
                                name="shownPower"
                                placeholder={json.event.placeholder_3}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Strength that has grown */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_4}
                            </label>
                            <Textarea
                                name="strengthGrown"
                                placeholder={json.event.placeholder_4}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* What I thought */}
                        <div className="flex flex-col gap-y-3">
                            <label htmlFor="eventsInSchoolLife">
                                {json.event.question_5}
                            </label>
                            <Textarea
                                name="myThought"
                                placeholder={json.event.placeholder_5}
                                disabled={isSubmitting}
                            />
                        </div>
                        <Button
                            type="submit"
                            startIcon={
                                isSubmitting ? (
                                    <CircularProgress
                                        size="1.5rem"
                                        sx={{color: "white"}}
                                    />
                                ) : null
                            }
                            disableRipple
                            variant="contained"
                        >
                            {isSubmitting ? "送信中" : "送信"}
                        </Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
