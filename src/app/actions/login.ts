"use server";

import {getJwtSecretKey} from "@/lib/auth";
import sql from "@/lib/db";
import * as argon2 from "argon2";
import {SignJWT} from "jose";
import {cookies} from "next/headers";
import {z} from "zod";

export type UserDto = {
    username: string;
    password: string;
    role: number;
};

export type LoginState =
    | {
          message: string;
          user?: Omit<UserDto, "password">;
      }
    | undefined;

export async function login(_: LoginState, formData: FormData) {
    const schema = z.object({
        username: z.string().min(1),
        password: z.string().min(1),
    });

    const parse = schema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!parse.success) {
        return {message: "必須フィールドが欠落しています。"};
    }

    const data = parse.data;
    const user = await sql<UserDto[]>`
        select
            u.username
            , u.password
            , u.role
        from
            ojt_user as u
        where
            u.username = ${data.username}
    `;
    if (user.length === 0) {
        return {message: "ユーザー名またはパスワードが間違っています。"};
    }

    try {
        if (await argon2.verify(user[0].password, data.password)) {
            const token = await new SignJWT({
                username: user[0].username,
                role: user[0].role,
            })
                .setProtectedHeader({alg: "HS256"})
                .setIssuedAt()
                .setExpirationTime("7 days")
                .sign(getJwtSecretKey());
            cookies().set({
                name: "token",
                value: token,
                path: "/",
            });
            return {
                user: {
                    username: user[0].username,
                    role: user[0].role,
                },
                message: "ログインに成功しました",
            };
        } else {
            return {message: "ユーザー名またはパスワードが間違っています。"};
        }
    } catch (error) {
        return {message: "ユーザー名またはパスワードが間違っています。"};
    }
}
