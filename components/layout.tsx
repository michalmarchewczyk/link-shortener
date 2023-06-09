import React from 'react';
import Head from 'next/head';
import { Container, useMantineColorScheme } from '@mantine/core';
import Navbar from '@/components/Navbar';
import ThemeSwitch from '@/components/ThemeSwitch';
import Image from 'next/image';
import background from '@/assets/background.png';
import backgroundWhite from '@/assets/background-white.png';

function Layout({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <Container size="xl" h="100vh">
        {children}
      </Container>
      <ThemeSwitch />
      {colorScheme === 'dark' && (
        <Image
          src={background}
          alt=""
          fill
          quality={100}
          priority
          style={{ zIndex: -1, opacity: 0.4 }}
          placeholder="blur"
        />
      )}
      {colorScheme !== 'dark' && (
        <Image
          src={backgroundWhite}
          alt=""
          fill
          quality={100}
          priority
          style={{ zIndex: -1, opacity: 0.7 }}
          placeholder="blur"
        />
      )}
    </>
  );
}

export default Layout;
