'use server';

import type {ITrackingData} from '~/features/tracking/types';
import ApiClient from '~/shared/lib/api-client';
import {client} from '~/shared/lib/hono-client';
import type {IApiResponse} from '~/shared/types';

export async function getTracking(studentCode: string) {
  const url = client.trackings
    .$url({query: {student_code: studentCode}})
    .toString();
  const res = await ApiClient.Hono.get<IApiResponse<ITrackingData>>(url);
  if (!res.data) {
    return undefined;
  }
  return res.data;
}
