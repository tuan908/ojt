'use server';

import {client} from '~/shared/lib/hono-client';

export async function getTracking(studentCode: string) {
  const res = await client.trackings.$get(studentCode);
  const resJson = await res.json();
  const studentInfo = resJson.data;
  return studentInfo;
}
