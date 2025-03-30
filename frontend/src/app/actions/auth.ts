"use server";

import type { LoginResponseDto } from "@/features/auth/types";
import { Route, SESSION, UserRole } from "@/shared/constants";
import json from "@/shared/i18n/locales/ja.json";
import ApiClient from "@/shared/lib/api-client";
import { encrypt } from "@/shared/lib/session";
import { SignInSchema } from "@/shared/lib/validations";
import { ApiResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Login
 * @param _ Previous state
 * @param formData FormData
 */
export async function signIn(_previousState: any, formData: FormData) {
    let redirectPath = "";
    try {
        // Convert FormData to object
        const data = Object.fromEntries(formData);
        const { username, password } = data;

        // Validate input
        const parse = SignInSchema.safeParse({ username, password });
        if (!parse.success) {
            return {
                error: json.error.missingRequiredFields,
                username,
                password,
            };
        }

        // API Request to Spring Backend
        const response = await ApiClient.Spring.post<
            ApiResponse<LoginResponseDto>
        >(Route.Login.toString(), parse.data);

        if (!response) {
            return {
                error: json.error.wrong_username_or_password,
                username,
                password,
            };
        }

        // Extract user data and JWT token
        const { accessToken: token, ...userProps } = response.data!;

        if (!userProps.username || !token) {
            return {
                error: json.error.invalidResponse,
                username,
                password,
            };
        }

        // Set HttpOnly Cookie (Prevents XSS Attacks)

        const { data: headers } = await tryCatch(
            Promise.all([cookies(), encrypt(userProps)])
        );

        if (headers) {
            const [reqCookies, session] = headers;

            reqCookies.set(SESSION, session, {
                path: "/",
                secure: process.env.NODE_ENV === "production", // Secure in production
            });

            // Determine Redirect Path Based on Role

            redirectPath =
                userProps.role !== UserRole.Student
                    ? "/students"
                    : `/students/${userProps.code}`;
        }
    } catch (error) {
        console.error("Login Error:", error);
        return {
            error: true,
            message: json.error.serverError,
            success: false,
            data: null,
        };
    } finally {
        redirect(redirectPath);
    }
}
/**
 * Logout
 */
export async function logOut() {
    const reqCookies = await cookies();
    reqCookies.delete(SESSION);
    redirect(Route.Login.toString());
}
