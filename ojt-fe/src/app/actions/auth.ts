"use server";

import {CollectionName, UserRole} from "@/constants";
import {sql} from "@/lib/db";
import {generateJWT} from "@/lib/utils/jwt";
import * as argon2 from "argon2";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";

export type AccountDto = {
    username: string;
    password: string;
    role: string;
};

export type LoginState = {
    message: string;
    user: Omit<AccountDto, "password"> | null;
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
    const [user] = await sql<AccountDto[]>`
        select
            username
            , password
            , role
        from
            ojt_user
        where
            username = ${data.username}
    `;
    if (!user) {
        return {message: "Incorrect username or password.", user: null};
    }

    try {
        if (await argon2.verify(user.password, data.password)) {
            const token = await generateJWT({
                username: user.username,
                role: user.role,
            });
            cookies().set({
                name: "token",
                value: token,
                path: "/",
            });
        } else {
            return {message: "Incorrect username or password.", user: null};
        }
    } catch (error) {
        return {message: "System Error", user: null};
    }

    let redirectPath = "";

    if (user.role !== UserRole.Student) {
        redirectPath = "/student/list";
    } else {
        const [result] = await sql<Array<{code: string}>>`
            select
                code
            from
                ojt_student os
            join 
                ojt_user ou on ou.id = os.user_id 
            where
                ou.username = ${data.username}
        `
        redirectPath = `/student/${result.code}`;
    }
    redirect(redirectPath);
}

export async function logOut() {
    cookies().delete("token");
    redirect("/login");
}
