import { jwtVerify, type JWTPayload } from "jose";

export type OjtJwtPayload = JWTPayload & {
    code: string;
    name: string;
    username: string;
    grade: string;
    role: string;
};

const JWT_SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
    throw new Error("JWT Secret key is not defined");
}

export function getJwtSecretKey(): Uint8Array {
    return new TextEncoder().encode(JWT_SECRET_KEY);
}

export async function verifyJwtToken(token: string): Promise<OjtJwtPayload | undefined> {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());
        return payload as OjtJwtPayload;
    } catch {
        return undefined;
    }
}