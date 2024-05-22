import {NextResponse, type NextRequest} from "next/server";
import {OjtRoute, OjtUserRole} from "./constants";
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

    if ((!token || !verifiedToken) && currentUrl.pathname !== OjtRoute.Login) {
        return NextResponse.redirect(new URL(OjtRoute.Login, request.url));
    }

    if (
        role !== OjtUserRole.Student &&
        currentUrl.pathname === OjtRoute.Login
    ) {
        if (
            currentUrl.pathname === OjtRoute.Login ||
            [OjtRoute.Root, OjtRoute.Home]
                .map(x => x.toString())
                .includes(currentUrl.pathname)
        ) {
            return NextResponse.redirect(
                new URL(OjtRoute.StudentList, request.url)
            );
        }
    }

    return NextResponse.next();
}
