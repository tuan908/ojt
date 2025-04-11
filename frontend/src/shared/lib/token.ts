'use server';

import {getCookie} from 'cookies-next';
import {cookies} from 'next/headers';
import {ACCESS_TOKEN} from '../constants';

export const getToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    // Server-side
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN)?.value ?? null;
  } else {
    // Client-side
    return getCookie(ACCESS_TOKEN)?.toString() ?? null;
  }
};
