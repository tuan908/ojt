import {jwtVerify, type JWTPayload} from "jose";

export type OjtJwtPayload = JWTPayload &
    Readonly<{
        name: string;
        username: string;
        grade: string;
        role: string;
    }>;

export function getJwtSecretKey() {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT Secret key is not matched");
    }
    return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token: string) {
    try {
        const {payload} = await jwtVerify<OjtJwtPayload>(
            token,
            getJwtSecretKey()
        );
        return payload;
    } catch (error) {
        return undefined;
    }
}
