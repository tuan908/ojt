'use server';

import {setCookie} from 'cookies-next/server';
import {isRedirectError} from 'next/dist/client/components/redirect-error';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import type {ILoginResponseDto} from '~/features/auth/types';
import {ACCESS_TOKEN, Route, UserRole} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import ApiClient from '~/shared/lib/api-client';
import {decrypt} from '~/shared/lib/session';
import {SignInSchema} from '~/shared/lib/validations';
import type {IApiResponse} from '~/shared/types';
import {tryCatch} from '~/shared/utils';

/**
 * Login
 * @param _ Previous state
 * @param formData FormData
 */
export async function signIn(_previousState: any, formData: FormData) {
  // Initialize with a default valid redirect path
  let redirectPath = '/';

  try {
    // Convert FormData to object
    const data = Object.fromEntries(formData);
    const {username, password} = data;

    // Validate input
    const parse = SignInSchema.safeParse({username, password});
    if (!parse.success) {
      return {
        message: json.error.missingRequiredFields,
        username,
        password,
      };
    }

    // API Request to Spring Backend
    const {data: response} = await tryCatch(
      ApiClient.Spring.post<IApiResponse<ILoginResponseDto>>(
        Route.Login.toString(),
        parse.data,
      ),
    );

    if (!response?.success) {
      return {
        message: json.error.invalidCredentials,
        username,
        password,
      };
    }

    // Extract user data and JWT token
    const {accessToken} = response.data!;

    // Set HttpOnly Cookie (Prevents XSS Attacks)
    await setCookie(ACCESS_TOKEN, accessToken, {
      cookies,
    });

    const session = await decrypt(accessToken);

    // Determine Redirect Path Based on Role

    redirectPath =
      session?.role !== UserRole.Student
        ? '/students'
        : `/students/${session.code}`;

    // Only redirect if we have a valid path
    if (redirectPath) {
      redirect(redirectPath);
    }

    // If we get here without redirecting, return success
    return {
      success: true,
      error: false,
      message: '',
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      error: true,
      message: json.error.internalServerError,
      success: false,
      data: null,
    };
  }
  // Remove the redirect from finally block
}

/**
 * Logout
 */
export async function logOut() {
  const reqCookies = await cookies();
  reqCookies.delete(ACCESS_TOKEN);
  redirect(Route.Login.toString());
}
