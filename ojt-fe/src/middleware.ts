import {NextResponse, type NextFetchEvent, type NextRequest} from "next/server";
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

export async function middleware(request: NextRequest, event: NextFetchEvent) {
    const token = request.cookies.get("token");
    const currentPath = request.nextUrl.pathname;

    const loginUrl = new URL(OjtRoute.Login, request.url);
    loginUrl.searchParams.set("from", currentPath);

    // Allow access to the login page without authentication
    if (currentPath === OjtRoute.Login) {
        if (token) {
            const maybeValidToken = await verifyJwtToken(token.value);
            if (maybeValidToken) {
                return handleAuthenticatedRedirect(maybeValidToken, request);
            }
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(loginUrl);
    }

    const maybeValidToken = await verifyJwtToken(token.value);

    if (!maybeValidToken) {
        return NextResponse.redirect(loginUrl);
    }

    return handleAuthenticatedRequest(maybeValidToken, request);
}

function handleAuthenticatedRedirect(tokenPayload: any, request: NextRequest) {
    const {role, code} = tokenPayload;

    if (role === OjtUserRole.Student) {
        return NextResponse.redirect(new URL(`/student/${code}`, request.url));
    } else {
        return NextResponse.redirect(
            new URL(OjtRoute.StudentList, request.url)
        );
    }
}

function handleAuthenticatedRequest(tokenPayload: any, request: NextRequest) {
    const {role, code} = tokenPayload;
    const currentPath = request.nextUrl.pathname;

    if (role === OjtUserRole.Student) {
        if (isAllowedStudentPath(currentPath, code)) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(
                new URL(`/student/${code}`, request.url)
            );
        }
    } else {
        if (isAllowedNonStudentPath(currentPath)) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(
                new URL(OjtRoute.StudentList, request.url)
            );
        }
    }
}

function isAllowedStudentPath(path: string, code: string) {
    const allowedStudentPaths = ["/", "/home", "/event", `/student/${code}`];
    return (
        allowedStudentPaths.includes(path) ||
        path.startsWith("/tracking/student")
    );
}

function isAllowedNonStudentPath(path: string) {
    const allowedNonStudentPaths = [
        "/",
        "/home",
        "/event",
        OjtRoute.StudentList,
    ];
    return (
        allowedNonStudentPaths.includes(path) ||
        path.startsWith("/tracking/student") ||
        path.startsWith("/student/")
    );
}

// To add more routes in the future, simply add them to the `allowedStudentPaths` and `allowedNonStudentPaths` arrays.
