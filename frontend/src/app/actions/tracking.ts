'use server';

import {client} from '~/shared/lib/hono-client';

export async function getTracking(studentCode: string) {
  const res = await client.trackings.$get({query: {student_code: studentCode}});
  const resJson = await res.json();
  const studentInfo = resJson.data;
  return studentInfo;
}
