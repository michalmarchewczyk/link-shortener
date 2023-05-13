import Head from 'next/head';
import { Box, Flex, Switch, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { IconForms, IconLink, IconChevronRight, IconLoader2 } from '@tabler/icons-react';
import classes from '@/styles/Home.module.scss';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import validator from 'validator';

export default function Home() {
  const form = useForm({
    initialValues: {
      url: '',
      slug: '',
      editable: false,
    },
    validate: {
      url: (value) => (validator.isURL(value) ? null : 'Invalid URL'),
      slug: (value) => (!value || validator.isSlug(value) ? null : 'Invalid slug'),
    },
    validateInputOnBlur: true,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async ({ url, slug, editable }: { url: string; slug: string; editable: boolean }) => {
    setLoading(true);
    const res = await fetch('/api/links', {
      method: 'POST',
      body: JSON.stringify({
        url,
        slug,
        editable,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.error) {
      form.setErrors(data.error);
    }
    if (data.slug) {
      await router.push(`/view/${data.slug}`);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Create - Marchewczyk.link</title>
      </Head>

      <Box component="form" onSubmit={form.onSubmit(submit)} h="100%">
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
            {...form.getInputProps('url')}
          />
          <TextInput
            className={classes.Input}
            radius="xl"
            size="xl"
            placeholder="Custom slug (leave empty for random)"
            w="100%"
            maw="36rem"
            icon={<IconForms size="1.6rem" />}
            styles={{
              icon: {
                paddingLeft: '6px',
              },
            }}
            {...form.getInputProps('slug')}
          />
          <Switch
            label="Editable"
            description="Generate key that allows you to edit link later"
            size="lg"
            w="100%"
            maw="36rem"
            className={classes.Switch}
            color="dark"
            {...form.getInputProps('editable', { type: 'checkbox' })}
          />
          <CustomButton
            label="Shorten"
            disabled={loading || !form.isValid() || !form.isDirty()}
            icon={loading ? <IconLoader2 size="1.6rem" /> : <IconChevronRight size="1.8rem" />}
            type="submit"
          />
        </Flex>
      </Box>
    </>
  );
}
