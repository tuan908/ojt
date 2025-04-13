import {NextResponse, type NextRequest} from 'next/server';
import {decrypt, type ISession} from '~/shared/lib/session';
import {ACCESS_TOKEN, Route, UserRole} from './shared/constants';
import {tryCatch} from './shared/utils';

export const config = {
  matcher: ['/', '/home', '/students', '/students/:id*'],
};

export async function middleware(request: NextRequest) {
  const accessTokenCookie = request.cookies.get(ACCESS_TOKEN);

  if (!accessTokenCookie) {
    return NextResponse.redirect(new URL(Route.Login.toString(), request.url));
  }

  const currentPath = request.nextUrl.pathname;
  const isLoginPath = currentPath === Route.Login.toString();

  // Create login URL with redirect parameter
  const loginUrl = new URL(Route.Login.toString(), request.url);
  loginUrl.searchParams.set('from', currentPath);

  // Try to get valid token if session exists
  let tokenPayload: ISession | undefined = undefined;

  if (accessTokenCookie) {
    const {data} = await tryCatch(decrypt(accessTokenCookie.value));
    if (data) {
      tokenPayload = data;
    }
  }

  // Handle login page separately
  if (isLoginPath) {
    return tokenPayload
      ? getRedirectForRole(tokenPayload, request)
      : NextResponse.next();
  }

  // Redirect to login if no valid session
  if (!tokenPayload) {
    return NextResponse.redirect(loginUrl);
  }

  // Handle authenticated user navigation
  const {role, code} = tokenPayload;

  if (role === UserRole.Student.toString() && !code) {
    return NextResponse.redirect(loginUrl); // Or show error
  }

  const isRootOrHome = ['/', '/home'].includes(currentPath);
  const redirectUrl =
    role === UserRole.Student.toString()
      ? `/students/${code}`
      : Route.Students.toString();

  if (isRootOrHome) {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // NEW LOGIC: Restrict students from accessing general students route
  if (role === UserRole.Student.toString()) {
    // Check if trying to access general students route
    if (currentPath === Route.Students.toString()) {
      // Redirect student to their specific page
      return NextResponse.redirect(new URL(`/students/${code}`, request.url));
    }

    // Check if student is trying to access another student's page
    if (
      currentPath.startsWith('/students/') &&
      !currentPath.startsWith(`/students/${code}`)
    ) {
      // Redirect to their own page
      return NextResponse.redirect(new URL(`/students/${code}`, request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Authorization', `Bearer ${accessTokenCookie.value}`);
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Content-Type', 'application/json');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Helper function to get the appropriate redirect based on user role
function getRedirectForRole(tokenPayload: any, request: NextRequest) {
  const {role, code} = tokenPayload;
  const redirectPath =
    role === UserRole.Student.toString()
      ? `/students/${code}`
      : Route.Students.toString();

  return NextResponse.redirect(new URL(redirectPath, request.url));
}
