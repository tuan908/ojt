'use server';

import type {IStudentDto} from '~/features/student/types';
import {EventStatus} from '~/shared/constants';
import ApiClient from '~/shared/lib/api-client';
import {client} from '~/shared/lib/hono-client';
import type {IApiResponse} from '~/shared/types';

/**
 * Get student by code
 * @param code Student code
 * @returns Student Response
 */
export const getStudentEventsByStudentCode = async (
  code: string,
  opts?: {
    grade?: string;
    eventName?: string;
    status?: EventStatus[];
    page?: number;
    pageSize?: number;
  },
) => {
  let params: URLSearchParams = new URLSearchParams();

  if (opts?.grade) {
    params.append('grade', opts.grade);
  }
  if (opts?.eventName) {
    params.append('event_name', opts.eventName);
  }
  if (opts?.status) {
    params.append('status', opts.status.join(','));
  }

  if (opts?.page) {
    params.append('page', opts.page.toString());
  }

  if (opts?.pageSize) {
    params.append('page_size', opts.pageSize.toString());
  }

  const apiResponse = await ApiClient.Spring.get<
    IApiResponse<IStudentDto['events']>
  >(`/students/${code}`, {
    tag: 'student',
    params: Object.fromEntries(params.entries()),
  });
  return apiResponse;
};

export const getStudentByCode = async (code: string) => {
  const apiResponse = await client.students[':code'].$get({param: {code}});
  const response = await apiResponse.json();
  return response;
};
