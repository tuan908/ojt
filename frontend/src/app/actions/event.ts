'use server';

import {cache} from 'react';
import type {IUpdateEventStatusDto} from '~/features/student-regist/types';
import type {
  ICreateStudentEventDto,
  IStudentDto,
  IStudentEventDto,
} from '~/features/student/types';
import {
  CreateStudentEventSchema,
  EditStudentEventSchema,
  type IEditStudentEventDto,
} from '~/features/student/validations';
import {
  createErrorResponse,
  createSuccessResponse,
} from '~/server/lib/api-response';
import {ErrorCodes} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import ApiClient from '~/shared/lib/api-client';
import type {IApiResponse} from '~/shared/types';
import {tryCatch} from '~/shared/utils';

/**
 * Update Event Status
 * @param dto Update Event Status Dto
 * @param code Student Code
 */
export async function updateEventStatus(dto: IUpdateEventStatusDto) {
  console.log(dto);
  const data = await ApiClient.Spring.patch(
    `/student-events/${dto.event_id}`,
    dto,
  );
  return data;
}

/**
 * Register Event
 * @param dto Register Event Dto
 */
export async function createStudentEvent(dto: ICreateStudentEventDto) {
  const parseResult = await CreateStudentEventSchema.safeParseAsync(dto);

  if (!parseResult.success) {
    return createErrorResponse({
      code: ErrorCodes.BAD_REQUEST,
      message: json.error.badRequest,
      errors: [
        ...parseResult.error.errors.flat().map(x => ({
          field: Array.isArray(x.path)
            ? x.path.join('')
            : String(x.path).replace('/', ''),
          message: x.message,
          code: x.code,
        })),
      ],
    });
  } else {
    const {data, error} = await tryCatch(
      ApiClient.Spring.post<IApiResponse<ICreateStudentEventDto>>(
        `/student-events`,
        parseResult,
      ),
    );
    if (error || !data.success) throw new Error('Failed to create');
    return createSuccessResponse(null);
  }
}

export async function editStudentEvent(dto: IEditStudentEventDto) {
  const parseResult = await EditStudentEventSchema.safeParseAsync(dto);

  if (!parseResult.success) {
    throw new Error('Internal Server Error');
  } else {
    await ApiClient.Spring.put<IApiResponse>(
      `/student-events/${parseResult.data.id}`,
      parseResult.data,
    );
  }
}

export const getStudentEvent = cache(
  async ({
    studentCode,
    studentEventId,
  }: Readonly<{
    studentCode: string;
    studentEventId: string;
  }>) => {
    const response = await ApiClient.Spring.get<IApiResponse<IStudentEventDto>>(
      `/student-events`,
      {
        tag: 'event-details',
        params: {
          studentCode,
          studentEventId,
        },
      },
    );
    return response?.data;
  },
);

export async function deleteEventDetailById(
  id: number,
): Promise<IStudentDto['events'] | undefined> {
  const res = await ApiClient.Spring.delete<IStudentDto['events']>(
    `/student-events/${id}`,
  );
  return res;
}

export async function addEvent(req: ICreateStudentEventDto) {
  const {data} = await tryCatch<IApiResponse>(
    ApiClient.Spring.post(`/student-events`, req),
  );
  if (data && data.success) {
    return {
      code: 'ok',
    };
  }
  return {
    code: 'ng',
  };
}
