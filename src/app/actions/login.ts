"use server";

import {Collection} from "@/constants";
import {getJwtSecretKey} from "@/lib/auth";
import db from "@/lib/db";
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
        return {message: "A required field is missing."};
    }

    const data = parse.data;
    const userCollection = await db.collection(Collection.User);
    const _user = await userCollection.findOne({
        username: data.username,
    });
    if (!_user) {
        return {message: "Incorrect username or password."};
    }
    const user = _user as UserDto;

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
            return {
                user: {
                    username: user.username,
                    role: user.role,
                },
                message: "Login succeeded",
            };
        } else {
            return {message: "Incorrect username or password."};
        }
    } catch (error) {
        return {message: "Incorrect username or password."};
    }
}
