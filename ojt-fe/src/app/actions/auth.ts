"use server";

import {UserRole} from "@/constants";
import {fetchNoCache} from "@/lib/utils/fetchNoCache";
import {generateJWT} from "@/lib/utils/jwt";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";

export type AccountDto = {
    id: number;
    name: string;
    username: string;
    role: string;
    grade: string;
    code: string;
};

export type LoginState = {
    message: string;
    user: AccountDto | null;
};

export async function login(_: any, formData: FormData) {
    const schema = z.object({
        username: z.string().min(1, {message: "Please input username"}),
        password: z.string().min(1, {message: "Please input password"}),
    });

    const parse = schema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!parse.success) {
        return {
            user: null,
            message: {
                username: parse.error.format().username?._errors[0],
                password: parse.error.format().password?._errors[0],
            },
        };
    }

    const data = parse.data;
    let user;

    try {
        const response = await fetchNoCache("/auth/login", "POST", data);
        const responseJson = await response.json();
        if (!responseJson) {
            return {message: "Incorrect username or password.", user: null};
        }
        user = responseJson as AccountDto;
        const token = await generateJWT(user);
        cookies().set({
            name: "token",
            value: token,
            path: "/",
        });
    } catch (error) {
        return {message: "System Error", user: null};
    }

    let redirectPath = "";

    if (user.role !== UserRole.Student) {
        redirectPath = "/student/list";
    } else {
        redirectPath = `/student/${user.code}`;
    }
    redirect(redirectPath);
}

export async function logOut() {
    cookies().delete("token");
    redirect("/login");
}
