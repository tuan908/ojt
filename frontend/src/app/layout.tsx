import {ThemeProvider} from '@mui/material';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import type {Metadata} from 'next';
import {Noto_Sans_JP} from 'next/font/google';
import type {PropsWithChildren} from 'react';
import {Toaster} from 'sonner';
import json from '~/shared/i18n/locales/ja.json';
import ReactQueryProvider from '~/shared/providers/react-query';
import theme from '~/shared/styles/theme';
import {cn} from '~/shared/utils';
import ReduxProvider from '../shared/providers/redux';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: json.appName,
    template: `%s | ${json.appName}`,
  },
  description: json.appName,
};

const notoSansJp = Noto_Sans_JP({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['vietnamese', 'latin'],
});

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={cn(
          'text-default w-full h-full bg-[#ededed]',
          notoSansJp.className,
        )}>
        <ReactQueryProvider>
          <ReduxProvider>
            <AppRouterCacheProvider
              options={{enableCssLayer: true, speedy: true}}>
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
