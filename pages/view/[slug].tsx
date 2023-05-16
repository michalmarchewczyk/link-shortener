import React from 'react';
import Link, { LinkType } from '@/lib/server/models/linkModel';
import { Flex, Title, Text, Box, Anchor } from '@mantine/core';
import classes from '@/styles/View.module.scss';
import CustomButton from '@/components/CustomButton';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export async function getServerSideProps({ params: { slug } }: { params: { slug: string } }) {
  const found = await Link.findOne({ slug }, { _id: 0, __v: 0 });
  return {
    props: {
      slug,
      found: found ? JSON.parse(JSON.stringify(found)) : null,
    },
  };
}

function ViewSlug({ slug, found }: { slug: string; found: LinkType | null }) {
  const router = useRouter();

  if (!found) {
    return (
      <Flex direction="column" align="center" gap={40} justify="center" h="100%">
        <Title order={1}>Link not found</Title>
        <Text fz="lg">Link with slug &quot;{slug}&quot; was not found</Text>
        <CustomButton
          label="Go back"
          iconLeft={<IconChevronLeft size="1.8rem" />}
          onClick={() => router.push('/view')}
        />
      </Flex>
    );
  }
  return (
    <>
      <Head>
        <title>Preview link - Marchewczyk.link</title>
      </Head>

      <Flex direction="column" align="center" gap={40} justify="center" h="100%">
        <Title order={1}>Preview Link</Title>
        <Box className={classes.Box}>
          <Text fz="lg" fw={500} component="span">
            Shortened:
          </Text>
          <Anchor fz="lg" fw={700} ml={10} color="primary" href={`https://marchewczyk.link/${found.slug}`}>
            https://marchewczyk.link/{found.slug}
          </Anchor>
          <br />
          <Text fz="lg" fw={500} component="span">
            Slug:
          </Text>
          <Text fz="lg" fw={700} ml={10} component="span">
            {found.slug}
          </Text>
          <br />
          <Text fz="lg" fw={500} component="span">
            URL:
          </Text>
          <Text fz="lg" fw={700} ml={10} component="span">
            {found.url}
          </Text>
          <br />
          <Text fz="lg" fw={500} component="span">
            Created:
          </Text>
          <Text fz="lg" fw={700} ml={10} component="span">
            {new Date(found.created).toLocaleString('en-GB')}
          </Text>
          <br />
          <Text fz="lg" fw={500} component="span">
            Last update:
          </Text>
          <Text fz="lg" fw={700} ml={10} component="span">
            {new Date(found.updated).toLocaleString('en-GB')}
          </Text>
          <br />
          <Text fz="lg" fw={500} component="span">
            Views:
          </Text>
          <Text fz="lg" fw={700} ml={10} component="span">
            {found.clicks}
          </Text>
        </Box>
        <CustomButton
          label="Go back"
          iconLeft={<IconChevronLeft size="1.8rem" />}
          onClick={() => router.push('/view')}
        />
      </Flex>
    </>
  );
}

export default ViewSlug;
