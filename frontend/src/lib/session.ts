import type { UserInfo } from "@/types/auth";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export type JwtPayload = JWTPayload & {
    code: string;
    name: string;
    username: string;
    grade: string;
    role: string;
};

function getJwtSecretKey(): Uint8Array {
    const sessionSecret = process.env.SESSION_SECRET;

    if (!sessionSecret) {
        throw new Error("JWT Secret key is not defined");
    }
    return new TextEncoder().encode(sessionSecret);
}

export async function decrypt(input: string) {
    try {
        const { payload } = await jwtVerify(input, getJwtSecretKey());
        return payload as JwtPayload;
    } catch {
        return undefined;
    }
}

/**
 * Generate token base on username and role
 * @param username username
 * @param role role
 * @returns JWT Token
 * @author tuanna
 */
export async function encrypt(dto: UserInfo) {
    return await new SignJWT(dto)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1 days")
        .sign(getJwtSecretKey());
}
