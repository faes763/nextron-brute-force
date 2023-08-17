import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Header from '../components/header';
import { StarrySky } from '../components/background';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        

      </Head>
      <QueryClientProvider client={queryClient}>
        <Header/>
        <StarrySky/>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp
