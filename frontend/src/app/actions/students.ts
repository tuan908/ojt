'use server';

import {cache} from 'react';
import ApiClient from '~/shared/lib/api-client';
import type {IApiResponse, IStudentDto, IStudentsDto} from '~/shared/types';

/**
 * Get Student List By Conditions
 * @param dto Request Dto
 * @returns Student List
 */

type StudentsRequest = IStudentDto & {page?: string; pageSize?: string};

export const getStudents = cache(async (dto?: StudentsRequest) => {
  // Use raw dto instead of JSON.stringify(dto) - dto already parse
  // to JSON string in fetchNoCache

  let params: Record<string, string> | undefined = undefined;

  if (typeof dto === 'undefined') {
    params = undefined;
  } else {
    const searchParams = new URLSearchParams();

    if (dto.name) {
      searchParams.append('name', dto.name);
    }

    if (dto.grade) {
      searchParams.append('grade', dto.grade);
    }

    if (dto.event) {
      searchParams.append('event', dto.event);
    }

    if (dto.hashtags) {
      searchParams.append('hashtags', dto.hashtags);
    }

    if (dto.page) {
      searchParams.append('page', dto.page);
    }

    if (dto.pageSize) {
      searchParams.append('page_size', dto.pageSize);
    }

    params = Object.fromEntries(searchParams.entries());
  }

  const data = await ApiClient.Spring.get<IApiResponse<IStudentsDto[]>>(
    '/students',
    {
      params,
    },
  );

  return data;
});
