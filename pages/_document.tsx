import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { createStylesServer, ServerStyles } from '@mantine/next';
import { emotionCache } from '@/lib/emotion-cache';

export default function _Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

const stylesServer = createStylesServer(emotionCache);

_Document.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [initialProps.styles, <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />],
  };
};
