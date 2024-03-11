import {jwtVerify, type JWTPayload} from "jose";

export type MyJwtPayload = JWTPayload &
    Readonly<{username: string; role: string}>;

export function getJwtSecretKey() {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT Secret key is not matched");
    }
    return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token: string) {
    try {
        const {payload} = await jwtVerify<MyJwtPayload>(
            token,
            getJwtSecretKey()
        );
        return payload;
    } catch (error) {
        return null;
    }
}
