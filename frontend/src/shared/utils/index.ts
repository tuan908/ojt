import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {UserRole} from '~/shared/constants';
import type {RecursivelyReplaceNullWithUndefined} from '~/shared/types';
import json from '../i18n/locales/ja.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertRole(role?: string) {
  switch (role) {
    case UserRole.Counselor:
      return json.role.counselor;

    case UserRole.Parent:
      return json.role.parent;

    case UserRole.Student:
      return json.role.student;

    case UserRole.Teacher:
      return json.role.teacher;

    default:
      throw new Error('Invalid Role');
  }
}

export function nullsToUndefined<T>(
  obj: T,
): RecursivelyReplaceNullWithUndefined<T> {
  if (obj === null) {
    return undefined as any;
  }

  // object check based on: https://stackoverflow.com/a/51458052/6489012
  if (obj?.constructor.name === 'Object') {
    for (let key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as any;
    }
  }
  return obj as any;
}

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  error: E;
  data: null;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return {data, error: null};
  } catch (error) {
    return {data: null, error: error as E};
  }
}

/**
 * Removes all properties with undefined values from an object
 * @param obj - The object to filter
 * @returns A new object excluding all undefined properties
 */
export function removeUndefined<T extends object>(
  obj: T,
): {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
} {
  if (!obj) return {} as any;

  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as any;
}

export function getUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
