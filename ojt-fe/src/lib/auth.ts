import {type UserInfo} from "@/app/actions/auth.action";
import {SignJWT, jwtVerify, type JWTPayload} from "jose";

export type JwtPayload = JWTPayload & {
    code: string;
    name: string;
    username: string;
    grade: string;
    role: string;
};

function getJwtSecretKey(): Uint8Array {
    const jwtSecretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

    if (!jwtSecretKey) {
        throw new Error("JWT Secret key is not defined");
    }
    return new TextEncoder().encode(jwtSecretKey);
}

export async function decrypt(input: string) {
    try {
        const {payload} = await jwtVerify(input, getJwtSecretKey());
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
    const token = await new SignJWT(dto)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("7 days")
        .sign(getJwtSecretKey());
    return token;
}
