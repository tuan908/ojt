import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export const config = {
    matcher: "/",
};

export function middleware(request: NextRequest) {
    const currentUrl = request.nextUrl.clone();

    if ("/".indexOf(currentUrl.pathname) !== -1) {
        return NextResponse.redirect(new URL("/student/list", request.url));
    }
    return NextResponse.next();
}
