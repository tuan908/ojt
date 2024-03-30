import {NextResponse, type NextRequest} from "next/server";
import {Route, UserRole} from "./constants";
import {verifyJwtToken} from "./lib/auth";

export const config = {
    matcher: [
        "/",
        "/home",
        "/student/list",
        "/student/:slug*",
        "/event",
        "/tracking/student/:slug*",
    ],
};

export async function middleware(request: NextRequest) {
    const currentUrl = request.nextUrl.clone();

    const token = request.cookies.get("token")?.value ?? null;
    const verifiedToken = await verifyJwtToken(token!);
    const role = verifiedToken?.role;

    if ((!token || !verifiedToken) && currentUrl.pathname !== Route.Login) {
        return NextResponse.redirect(new URL(Route.Login, request.url));
    }

    if (role !== UserRole.Student) {
        if (
            currentUrl.pathname === Route.Login ||
            [Route.Root, Route.Home]
                .map(x => x.toString())
                .includes(currentUrl.pathname)
        ) {
            return NextResponse.redirect(
                new URL(Route.StudentList, request.url)
            );
        }
    }

    return NextResponse.next();
}
