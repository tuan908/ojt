'use server';

import type {ITrackingData} from '~/features/tracking/types';
import ApiClient from '~/shared/lib/api-client';
import type {IApiResponse} from '~/shared/types';

export async function getTracking(studentCode: string) {
  const response = await ApiClient.Hono.get<IApiResponse<ITrackingData>>(
    `/trackings`,
    {
      tag: 'trackings',
      params: {studentCode},
    },
  );
  return response?.data;
}
