"use server";

import {Collection, UserRole} from "@/constants";
import {getJwtSecretKey} from "@/lib/auth";
import {astraDb} from "@/lib/db";
import * as argon2 from "argon2";
import {SignJWT} from "jose";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";

export async function logOut() {
    cookies().delete("token");
    redirect("/login");
}

export type AccountDto = {
    username: string;
    password: string;
    role: string;
};

export type LoginState =
    | {
          message: string;
          user?: Omit<AccountDto, "password">;
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
        return {message: "A required field is missing."};
    }

    const data = parse.data;
    const accountCollection = await astraDb.collection(Collection.Account);
    const _user = await accountCollection.findOne({
        username: data.username,
    });
    if (!_user) {
        return {message: "Incorrect username or password."};
    }
    const user = _user as AccountDto;

    try {
        if (await argon2.verify(user.password, data.password)) {
            const token = await new SignJWT({
                username: user.username,
                role: user.role,
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
        } else {
            return {message: "Incorrect username or password."};
        }
    } catch (error) {
        return {message: "Incorrect username or password."};
    }

    let redirectPath = "";

    if (user.role !== UserRole.Student) {
        redirectPath = "/student/list";
    } else {
        redirectPath = `/student/ST0001`;
    }
    redirect(redirectPath);
}
