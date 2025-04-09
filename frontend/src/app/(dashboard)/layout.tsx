import type {Metadata} from 'next';
import type {PropsWithChildren} from 'react';
import Navbar from '~/shared/components/navbar';
import {getSession} from '~/shared/lib/session';

export const metadata: Metadata = {
  title: {
    default: '学生',
    template: '%s | 学生',
  },
  description: '学生イベント',
};

export default function Layout({children}: PropsWithChildren) {
  const sessionPromise = getSession();

  return (
    <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
      <Navbar sessionPromise={sessionPromise} />
      <div className="w-full h-full flex-1 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
