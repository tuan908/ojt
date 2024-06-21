import json from "@/i18n/jp.json";
import {z} from "zod";

export const signInSchema = z.object({
    username: z
        .string({required_error: json.error.username_required})
        .min(1, json.error.username_required),
    password: z
        .string({required_error: json.error.password_required})
        .min(1, json.error.password_required)
        .min(8, json.error.password_min_length)
        .max(32, json.error.password_max_length),
});
