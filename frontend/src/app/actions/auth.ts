'use server';

import {isRedirectError} from 'next/dist/client/components/redirect-error';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import type {ILoginResponseDto} from '~/features/auth/types';
import {Route, SESSION, UserRole} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import ApiClient from '~/shared/lib/api-client';
import {encrypt} from '~/shared/lib/session';
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
        error: json.error.missingRequiredFields,
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

    if (!response || !response.data) {
      return {
        error: json.error.invalidCredentials,
        username,
        password,
      };
    }

    // Extract user data and JWT token
    const {accessToken: token, ...userProps} = response.data;

    if (!userProps.username || !token) {
      return {
        error: json.error.invalidResponse,
        username,
        password,
      };
    }

    // Set HttpOnly Cookie (Prevents XSS Attacks)

    const {data: headers} = await tryCatch(
      Promise.all([cookies(), encrypt(userProps)]),
    );

    if (headers) {
      const [reqCookies, session] = headers;

      reqCookies.set(SESSION, session, {
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Secure in production
      });

      // Determine Redirect Path Based on Role

      redirectPath =
        userProps.role !== UserRole.Student
          ? '/students'
          : `/students/${userProps.code}`;

      // Only redirect if we have a valid path
      if (redirectPath) {
        redirect(redirectPath);
      }
    }

    // If we get here without redirecting, return success
    return {
      success: true,
      error: false,
      message: null,
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
  reqCookies.delete(SESSION);
  redirect(Route.Login.toString());
}
