import Head from 'next/head';
import { Box, Flex, TextInput, Title } from '@mantine/core';
import classes from '@/styles/Forms.module.scss';
import { IconChevronRight, IconForms, IconLoader2 } from '@tabler/icons-react';
import CustomButton from '@/components/CustomButton';
import { useForm } from '@mantine/form';
import validator from 'validator';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_NAME } from '@/lib/constants';

export default function Index() {
  const form = useForm({
    initialValues: {
      slug: '',
    },
    validate: {
      slug: (value) => (!value || validator.isSlug(value) ? null : 'Invalid slug'),
    },
    validateInputOnBlur: true,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async ({ slug }: { slug: string }) => {
    setLoading(true);
    const res = await fetch(`/api/links/${slug}?preview=true`);
    const data = await res.json();
    if (data.error) {
      if (typeof data.error === 'string') {
        form.setErrors({ slug: data.error });
      } else {
        form.setErrors(data.error);
      }
    }
    if (data.slug) {
      await router.push(`/view/${data.slug}`);
    }
    setLoading(false);
  };

  const pageTitle = `View - ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Box component="form" onSubmit={form.onSubmit(submit)} h="100%">
        <Flex direction="column" align="center" gap={40} justify="center" h="100%">
          <Title order={1}>Preview link:</Title>
          <TextInput
            className={classes.Input}
            radius="xl"
            size="xl"
            placeholder="Slug"
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
          <CustomButton
            label="View"
            disabled={loading || !form.isValid() || !form.isDirty()}
            iconRight={loading ? <IconLoader2 size="1.6rem" /> : <IconChevronRight size="1.8rem" />}
            type="submit"
          />
        </Flex>
      </Box>
    </>
  );
}
