import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {UserRole} from '~/shared/constants';
import {getSession, ISession} from '~/shared/lib/session';

/**
 * Determines the appropriate redirect URL based on user session status and role
 */
function getRedirectUrl(session?: ISession): string {
  if (!session) {
    return '/auth/login';
  }

  return session.role === UserRole.Student
    ? `/students/${session.code}`
    : '/students';
}

export default async function NotFound() {
  const session = await getSession();
  const redirectUrl = getRedirectUrl(session);

  return (
    <main className="w-full h-screen flex flex-col">
      <nav className="px-12 py-8 flex items-center">
        <Link
          href={redirectUrl}
          className="flex items-center gap-2 text-base font-semibold"
          aria-label="戻る">
          <ChevronLeft size="1.5rem" aria-hidden="true" />
          <span>戻る</span>
        </Link>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center gap-y-4">
        <h1 className="text-9xl font-semibold">404</h1>
        <h2 className="text-4xl font-semibold">ページが見つかりません</h2>
      </section>
    </main>
  );
}
