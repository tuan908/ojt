"use client";

import { addEvent } from "@/app/actions/event";
import { Button } from "@/shared/components/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shared/components/form";
import Textarea from "@/shared/components/legacy/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/select";
import { errorToast, successToast } from "@/shared/components/toast";
import { QUERY_KEY } from "@/shared/constants";
import json from "@/shared/i18n/locales/ja.json";
import type { IEvent } from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import AddCircle from "@mui/icons-material/AddCircle";
import { FormLabel } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { RegisterEvent } from "../types";
import { NewEventFormSchema } from "../validations";

interface HeaderProps {
    eventOptions: IEvent[];
    studentCode: string;
    gradeName: string;
    username: string;
}

export type NewEventFormData = z.infer<typeof NewEventFormSchema>;

export default function NewEventForm({
    eventOptions,
    gradeName,
    studentCode,
    username,
}: HeaderProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        if (!open) return;
        setOpen(!open);
    };

    const form = useForm<NewEventFormData>({
        resolver: async (data, ctx, opts) => {
            console.log(await zodResolver(NewEventFormSchema)(data, ctx, opts));
            return zodResolver(NewEventFormSchema)(data, ctx, opts);
        }
    });

    const { mutate, isPending: isSubmitting } = useMutation({
        mutationFn: async (data: NewEventFormData) => {
            const dto: RegisterEvent = {
                data,
                studentCode,
                username,
                gradeName,
            };
            return await addEvent(dto);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.STUDENTS],
            });
            setOpen(false);
            successToast();
        },
        onError: error => errorToast(error.message),
    });

    const onSubmit = (data: NewEventFormData) => {
        mutate(data);
    };

    return (
        <div className="w-24/25 m-auto flex items-center pb-3">
            <Dialog>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="flex gap-x-2 items-center px-6 py-2 bg-[#33b5e5] text-white rounded-lg hover:opacity-80"
                    >
                        <AddCircle />
                        <span>新規作成</span>
                    </button>
                </DialogTrigger>
                <DialogContent className="w-full">
                    <DialogHeader>
                        <DialogTitle>新規作成</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full flex flex-col gap-y-3 m-auto p-4"
                        >
                            <FormField
                                control={form.control}
                                name="eventName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {json.event.select_event}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full px-4 py-2">
                                                    <SelectValue
                                                        placeholder={
                                                            json.event
                                                                .placeholder_0
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel className="px-4">
                                                        {
                                                            json.event
                                                                .placeholder_0
                                                        }
                                                    </SelectLabel>
                                                    {eventOptions!?.map(
                                                        option => (
                                                            <SelectItem
                                                                key={option.id}
                                                                value={
                                                                    option.name
                                                                }
                                                            >
                                                                {option.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Events in school life */}
                            <FormField
                                control={form.control}
                                name="eventsInSchoolLife"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>
                                            {json.event.question_1}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    json.event.placeholder_1
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* My Actions */}
                            <FormField
                                control={form.control}
                                name="myAction"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>
                                            {json.event.question_2}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    json.event.placeholder_2
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Shown power */}

                            <FormField
                                control={form.control}
                                name="shownPower"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>
                                            {json.event.question_3}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    json.event.placeholder_3
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Strength that has grown */}
                            <FormField
                                control={form.control}
                                name="strengthGrown"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>
                                            {json.event.question_4}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    json.event.placeholder_4
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* What I thought */}
                            <FormField
                                control={form.control}
                                name="myThought"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>
                                            {json.event.question_5}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    json.event.placeholder_5
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="w-full"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        "送信中。。。"
                                    </>
                                ) : (
                                    "送信"
                                )}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
