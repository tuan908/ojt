import json from "@/shared/i18n/locales/ja.json";
import { z } from "zod";

export const SignInSchema = z.object({
    username: z
        .string({ required_error: json.error.usernameRequired })
        .min(1, json.error.usernameRequired),
    password: z
        .string({ required_error: json.error.passwordRequired })
        .min(1, json.error.passwordRequired)
        .max(32, json.error.passwordMaxLength),
});
