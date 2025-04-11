'use client';
import {QueryClientProvider} from '@tanstack/react-query';
import {getQueryClient} from '~/shared/lib/get-query-client';

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
