"use server";

import {OjtUserRole} from "@/constants";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import {generateJWT} from "@/lib/utils/jwt";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";

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
    user: UserInfo | null;
};

/**
 * Login
 * @param _ ???
 * @param formData FormData
 */
export async function login(_: any, formData: FormData) {
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
            error: process.env["MISSING_REQUIRED_FIELDS"],
            username,
            password,
        };
    }

    const request = parse.data;

    const user = await fetchNoCache<UserInfo>("/auth/login", "POST", request);
    if (!user) {
        return {
            error: process.env["WRONG_USER_NAME_OR_PASSWORD"],
            username,
            password,
        };
    }
    const token = await generateJWT(user);
    cookies().set({
        name: "token",
        value: token,
        path: "/",
    });

    let redirectPath = "";

    if (user.role !== OjtUserRole.Student) {
        redirectPath = "/student/list";
    } else {
        redirectPath = `/student/${user.code}`;
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
