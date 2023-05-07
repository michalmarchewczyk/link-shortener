import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { emotionCache } from '@/lib/emotion-cache';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS withCSSVariables emotionCache={emotionCache}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
