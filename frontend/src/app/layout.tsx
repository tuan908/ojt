import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import type {Metadata} from 'next';
import type {PropsWithChildren} from 'react';
import {Toaster} from 'sonner';
import json from '~/shared/i18n/locales/ja.json';
import ReactQueryProvider from '~/shared/providers/react-query';
import theme from '~/shared/styles/theme';
import ReduxProvider from '../shared/providers/redux';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: json.appName,
    template: `%s | ${json.appName}`,
  },
  description: json.appName,
};

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="text-default w-full h-full min-h-dvh max-w-dvw bg-[#ededed]">
        <ReactQueryProvider>
          <ReduxProvider>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <main>{children}</main>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </ReduxProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
