import 'swiper/css/bundle';
import '../styles/global.css';

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';

import { InitGlobalData } from '@/layouts/InitGlobalData';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // default: true
          },
        },
      })
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'inherit',
        },
      }}
    >
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />

            <InitGlobalData />
          </Hydrate>
        </QueryClientProvider>
      </RecoilRoot>
    </ConfigProvider>
  );
};

export default MyApp;
