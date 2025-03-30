import { SESSION } from "@/shared/constants";
import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";

export const verifySession = cache(async () => {
    const reqCookies = await cookies();
    const session = reqCookies.get(SESSION)?.value;

    if (!session || !(await decrypt(session))) {
        return undefined;
    }

    return await decrypt(session);
});
