import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { emotionCache } from '@/lib/emotion-cache';
import Layout from '@/components/layout';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={poppins.className}>
      <MantineProvider withGlobalStyles withNormalizeCSS withCSSVariables emotionCache={emotionCache}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </div>
  );
}
