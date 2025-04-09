'use client';

import {useEffect} from 'react';
import json from '~/shared/i18n/locales/ja.json';

type GlobalErrorProps = {
  error: Error & {digest?: string};
  reset: () => void;
};

export default function GlobalError({error, reset}: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-dvw h-dvh flex flex-col gap-y-8 justify-center items-center">
      <h1 className="text-red-500 text-6xl font-bold">500</h1>
      <h1 className="text-red-500 text-4xl font-bold">エラーが発生しました</h1>
      <button onClick={() => reset()}>{json.error.tryAgain}</button>
    </div>
  );
}
