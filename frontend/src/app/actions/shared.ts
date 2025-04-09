'use server';

import {cache} from 'react';
import ApiClient from '~/shared/lib/api-client';
import type {
  IApiResponse,
  IEventDto,
  IGradeDto,
  IHashtagDto,
} from '~/shared/types';

/**
 * Get Grade List
 * @returns Grade List or empty array if error occurs
 */
export const getGrades = cache(async (): Promise<IGradeDto[]> => {
  try {
    const response = await ApiClient.Hono.get<IApiResponse<IGradeDto[]>>(
      '/grades',
      {
        tag: 'grades',
      },
    );
    return response?.data ?? []; // ✅ Ensure it always returns an array
  } catch (error) {
    console.error('Error fetching grades:', error);
    return []; // ✅ Fallback to empty array
  }
});

/**
 * Get current event list
 * @returns Event List or empty array if error occurs
 */
export const getEvents = cache(async (): Promise<IEventDto[]> => {
  try {
    const response = await ApiClient.Hono.get<IApiResponse<IEventDto[]>>(
      '/events',
      {
        tag: 'events',
      },
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
});

/**
 * Get hashtag list
 * @returns Hashtag list or empty array if error occurs
 */
export const getHashtags = cache(async (): Promise<IHashtagDto[]> => {
  try {
    const response = await ApiClient.Hono.get<IApiResponse<IHashtagDto[]>>(
      '/hashtags',
      {
        tag: 'hashtags',
      },
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Error fetching hashtags:', error);
    return [];
  }
});
