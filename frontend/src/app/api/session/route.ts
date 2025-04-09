import {NextResponse} from 'next/server';

import {getSession} from '~/shared/lib/session';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({message: 'Not logged in'}, {status: 401});
  }

  return NextResponse.json({session}, {status: 200});
}
