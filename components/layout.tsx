import React from 'react';
import Head from 'next/head';
import { Container } from '@mantine/core';
import Navbar from '@/components/Navbar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <Container size="xl" mt={120}>
        {children}
      </Container>
    </>
  );
}

export default Layout;
