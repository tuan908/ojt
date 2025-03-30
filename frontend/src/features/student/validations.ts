import json from "@/shared/i18n/locales/ja.json";
import { z } from "zod";

export const NewEventFormSchema = z.object({
    eventName: z
        .string({ message: json.error.missingRequiredFields })
        .min(1, { message: json.error.missingRequiredFields }),
    eventsInSchoolLife: z.string().optional(),
    myAction: z.string().optional(),
    shownPower: z.string().optional(),
    strengthGrown: z.string().optional(),
    myThought: z.string().optional(),
});

export const StudentEventDataSchema = z.object({
    eventName: z
        .string()
        .optional()
        .superRefine((val, ctx) => {
            if (val === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: json.error.eventFieldRequired,
                });
            }

            return z.NEVER;
        }),
    eventsInSchoolLife: z.string().optional(),
    myAction: z.string().optional(),
    shownPower: z.string().optional(),
    strengthGrown: z.string().optional(),
    myThought: z.string().optional(),
});

export const StudentEventSchema = z.object({
    studentCode: z.string(),
    username: z.string(),
    gradeName: z.string(),
    data: StudentEventDataSchema,
});

export const CommentSchema = z.object({
    id: z.number().optional(),
    studentEventId: z.number(),
    username: z.string(),
    content: z.string().optional(),
});
