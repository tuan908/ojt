"use server";

import { Route, SESSION, UserRole } from "@/constants";
import json from "@/i18n/jp.json";
import API from "@/lib/api";
import { encrypt } from "@/lib/session";
import { signInSchema } from "@/lib/zod";
import { ApiResponse } from "@/types";
import type { LoginResponseDto } from "@/types/auth";
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
        const parse = signInSchema.safeParse({ username, password });
        if (!parse.success) {
            return {
                error: json.error.missing_required_fields,
                username,
                password,
            };
        }

        // API Request to Spring Backend
        const response = await API.SPRING_API.post<
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
                error: json.error.invalid_response,
                username,
                password,
            };
        }

        // Set HttpOnly Cookie (Prevents XSS Attacks)
        const reqCookies = await cookies();
        const session = await encrypt(userProps);

        reqCookies.set(SESSION, session, {
            path: "/",
            secure: process.env.NODE_ENV === "production", // Secure in production
        });

        // Determine Redirect Path Based on Role

        redirectPath =
            userProps.role !== UserRole.Student
                ? "/students"
                : `/students/${userProps.code}`;
    } catch (error) {
        console.error("Login Error:", error);
        return {
            error: json.error.server_error,
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
