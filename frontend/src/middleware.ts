import { decrypt } from "@/lib/session";
import { NextResponse, type NextRequest } from "next/server";
import { Route, UserRole } from "./constants";

export const config = {
    matcher: ["/", "/home", "/students", "/students/:id*"],
};

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session");
    const currentPath = request.nextUrl.pathname;

    const loginUrl = new URL(Route.Login, request.url);
    loginUrl.searchParams.set("from", currentPath);

    // Allow access to the login page without authentication
    if (currentPath === Route.Login) {
        if (session) {
            const maybeValidToken = await decrypt(session.value);
            if (maybeValidToken) {
                return handleAuthenticatedRedirect(maybeValidToken, request);
            }
        }
        return NextResponse.next();
    }

    if (!session) {
        return NextResponse.redirect(loginUrl);
    }

    const maybeValidToken = await decrypt(session.value);

    if (!maybeValidToken) {
        return NextResponse.redirect(loginUrl);
    }

    return handleAuthenticatedRequest(maybeValidToken, request);
}

function handleAuthenticatedRedirect(tokenPayload: any, request: NextRequest) {
    const { role, code } = tokenPayload;

    if (role === UserRole.Student.toString()) {
        return NextResponse.redirect(new URL(`/students/${code}`, request.url));
    } else {
        return NextResponse.redirect(new URL(Route.Students, request.url));
    }
}

function handleAuthenticatedRequest(tokenPayload: any, request: NextRequest) {
    const { role, code } = tokenPayload;
    const currentPath = request.nextUrl.pathname;

    if (role === UserRole.Student.toString()) {
        if (!isRootOrHomeRoute(currentPath)) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(
                new URL(`/students/${code}`, request.url)
            );
        }
    } else {
        if (!isRootOrHomeRoute(currentPath)) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL(Route.Students, request.url));
        }
    }
}

const isRootOrHomeRoute = (currentPath: string) =>
    ["/", "/home"].includes(currentPath);

// To add more routes in the future, simply add them to the `allowedStudentPaths` and `allowedNonStudentPaths` arrays.
