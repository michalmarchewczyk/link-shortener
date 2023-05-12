import Head from 'next/head';
import { Box, Flex, Switch, TextInput, Title } from '@mantine/core';
import { FormEvent, useState } from 'react';
import { IconForms, IconLink, IconChevronRight, IconLoader2 } from '@tabler/icons-react';
import classes from '@/styles/Home.module.scss';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'next/router';

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [customSlug, setCustomSlug] = useState<string>('');
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    const res = await fetch('/api/links', {
      method: 'POST',
      body: JSON.stringify({
        url,
        slug: customSlug,
        editable,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setLoading(false);
    if (data.slug) {
      await router.push(`/view/${data.slug}`);
    }
  };

  return (
    <>
      <Head>
        <title>Create - Marchewczyk.link</title>
      </Head>

      <Box component="form" onSubmit={submit} h="100%">
        <Flex direction="column" align="center" gap={40} justify="center" h="100%">
          <Title order={1}>Shorten link:</Title>
          <TextInput
            className={classes.Input}
            radius="xl"
            size="xl"
            placeholder="Your link"
            w="100%"
            maw="36rem"
            icon={<IconLink size="1.6rem" />}
            styles={{
              icon: {
                paddingLeft: '6px',
              },
            }}
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
          />
          <TextInput
            className={classes.Input}
            radius="xl"
            size="xl"
            placeholder="Custom slug (leave empty for random)"
            w="100%"
            maw="36rem"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.currentTarget.value)}
            icon={<IconForms size="1.6rem" />}
            styles={{
              icon: {
                paddingLeft: '6px',
              },
            }}
          />
          <Switch
            label="Editable"
            description="Generate key that allows you to edit link later"
            size="lg"
            w="100%"
            maw="36rem"
            className={classes.Switch}
            color="dark"
            checked={editable}
            onChange={() => setEditable((v) => !v)}
          />
          <CustomButton
            label="Shorten"
            icon={loading ? <IconLoader2 size="1.8rem" /> : <IconChevronRight size="1.8rem" />}
            onClick={() => submit()}
          />
        </Flex>
      </Box>
    </>
  );
}
