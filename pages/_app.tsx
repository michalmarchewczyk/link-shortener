import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { emotionCache } from '@/lib/emotion-cache';
import Layout from '@/components/layout';
import { Poppins } from 'next/font/google';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';

const poppins = Poppins({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--poppins-font',
});

export default function App({ Component, pageProps }: AppProps) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <div className={poppins.className} data-dark-scheme={colorScheme === 'dark' ? true : undefined}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          withCSSVariables
          emotionCache={emotionCache}
          theme={{
            colorScheme,
            fontFamily: 'var(--poppins-font), sans-serif',
            globalStyles: (theme) => ({
              body: {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
              },
            }),
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  );
}
