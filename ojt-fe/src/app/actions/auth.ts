"use server";

import {UserRole} from "@/constants";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import {generateJWT} from "@/lib/utils/jwt";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";

/**
 * Account Data
 */
export type AccountDto = {
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
    user: AccountDto | null;
};

/**
 * Login
 * @param _ ???
 * @param formData FormData
 */
export async function login(
    _: any,
    formData: FormData
): Promise<{error?: string}> {
    const schema = z.object({
        username: z.string().min(1),
        password: z.string().min(1),
    });

    const parse = schema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!parse.success) {
        return {
            error: process.env["MISSING_REQUIRED_FIELDS"],
        };
    }

    const request = parse.data;

    const user = await fetchNoCache<AccountDto>("/auth/login", "POST", request);
    if (!user) {
        return {
            error: process.env["WRONG_USER_NAME_OR_PASSWORD"],
        };
    }
    const token = await generateJWT(user);
    cookies().set({
        name: "token",
        value: token,
        path: "/",
    });

    let redirectPath = "";

    if (user.role !== UserRole.Student) {
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
