import {type AccountDto} from "@/app/actions/auth";
import {SignJWT} from "jose";
import {getJwtSecretKey} from "../auth";

/**
 * Generate token base on username and role
 * @param username username
 * @param role role
 * @returns JWT Token
 * @author tuanna
 */
export async function generateJWT(dto: Omit<AccountDto, "password">) {
    const token = await new SignJWT(dto)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("7 days")
        .sign(getJwtSecretKey());
    return token;
}
