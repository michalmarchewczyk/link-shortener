import React from 'react';
import Head from 'next/head';
import { Flex, Text, Title } from '@mantine/core';
import CustomButton from '@/components/CustomButton';
import { IconHome } from '@tabler/icons-react';
import { useRouter } from 'next/router';

function NotFound() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Page Not Found - marchewczyk.link</title>
      </Head>

      <Flex align="center" justify="center" direction="column" h="100%" gap={40}>
        <Text fw={800} fz={120} mt={-60} mb={-20}>
          404
        </Text>
        <Title order={1}>Page not found</Title>
        <CustomButton label="Go home" iconLeft={<IconHome size="1.8rem" />} onClick={() => router.push('/')} />
      </Flex>
    </>
  );
}

export default NotFound;
