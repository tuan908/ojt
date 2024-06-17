"use server";

import {UserRole} from "@/constants";
import AuthService from "@/services/auth.service";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";
import json from "@/i18n/jp.json";
import HttpClient from "@/configs/http-client.config";

/**
 * UserInfo
 */
export type UserInfo = {
    id: number;
    name: string;
    username: string;
    role: string;
    grade: string;
    code: string;
};

/**
 * Login State
 */
export type LoginState = {
    message: string;
    user?: UserInfo;
};

/**
 * Login
 * @param _ Previous state
 * @param formData FormData
 */
export async function login(_previousState: any, formData: FormData) {
    const data = Object.fromEntries(formData);
    const {username, password} = data;

    const schema = z.object({
        username: z.string().min(1),
        password: z.string().min(1),
    });

    const parse = schema.safeParse({
        username,
        password,
    });

    if (!parse.success) {
        return {
            error: json.error.missing_required_fields,
            username,
            password,
        };
    }

    const request = parse.data;

    const user = await HttpClient.post<UserInfo>("/auth/login", request);
    if (!user) {
        return {
            error: json.error.wrong_username_or_password,
            username,
            password,
        };
    }
    const token = await AuthService.generateToken(user);
    cookies().set({
        name: "token",
        value: token,
        path: "/",
    });

    let redirectPath = "";

    if (user.role !== UserRole.Student) {
        redirectPath = "/students";
    } else {
        redirectPath = `/students/${user.code}`;
    }
    redirect(redirectPath);
}

/**
 * Logout
 */
export async function logOut() {
    cookies().delete("token");
    redirect("/login");
}
