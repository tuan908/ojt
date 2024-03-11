import {NextRequest, NextResponse} from "next/server";
import {UserRole} from "./constants";
import {verifyJwtToken} from "./lib/auth";

export const config = {
    matcher: [
        "/",
        "/home",
        "/student/list",
        "/student/:slug*",
        "/event/register",
        "/tracking/student/:slug*",
    ],
};

export async function middleware(request: NextRequest) {
    const currentUrl = request.nextUrl.clone();

    const token = request.cookies.get("token")?.value ?? null;
    const verifiedToken = await verifyJwtToken(token!);
    const role = verifiedToken?.role as string;

    if (!token && currentUrl.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (currentUrl.pathname === "/login") {
        if (role !== UserRole.Student) {
            return NextResponse.redirect(new URL("/student/list", request.url));
        }
    }

    if (
        ["/", "/home"].includes(currentUrl.pathname) &&
        role !== UserRole.Student
    ) {
        return NextResponse.redirect(new URL("/student/list", request.url));
    }

    return NextResponse.next();
}
