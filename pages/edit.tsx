import Head from 'next/head';
import { Box, Button, Flex, Modal, Text, TextInput, Title } from '@mantine/core';
import classes from '@/styles/Forms.module.scss';
import { IconCheck, IconExternalLink, IconForms, IconKey, IconLink, IconLoader2 } from '@tabler/icons-react';
import CustomButton from '@/components/CustomButton';
import { useForm } from '@mantine/form';
import validator from 'validator';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

export default function Edit() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      url: '',
      slug: '',
      editToken: '',
    },
    validate: {
      url: (value) => (validator.isURL(value) ? null : 'Invalid URL'),
      slug: (value) => (validator.isSlug(value) ? null : 'Invalid slug'),
      editToken: (value) => (value.length === 32 && validator.isBase64(value) ? null : 'Invalid edit token'),
    },
    validateInputOnBlur: true,
  });
  const [loading, setLoading] = useState(false);

  const submit = async ({ url, slug, editToken }: { url: string; slug: string; editToken: string }) => {
    setLoading(true);
    const res = await fetch(`/api/links/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify({
        url,
        editToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.error) {
      if (typeof data.error === 'string') {
        form.setErrors({ slug: data.error });
      } else {
        form.setErrors(data.error);
      }
    }
    if (data.slug) {
      open();
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Edit - Marchewczyk.link</title>
      </Head>

      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        classNames={{ content: classes.Modal, overlay: classes.ModalOverlay }}
        zIndex={10000}
        withinPortal={false}
        size={320}
      >
        <Flex direction="column" align="center" gap={12}>
          <Title order={2} fz={26} align="center" mb={10} mt={4}>
            Link edited
          </Title>
          <Text fz={16} fw={500} align="center" px={20}>
            Link has been edited successfully.
          </Text>
          <Button
            variant="subtle"
            color="dark"
            component={Link}
            href={`/view/${form.values.slug}`}
            radius="xl"
            size="lg"
            rightIcon={<IconExternalLink size="1.6rem" />}
            mt={10}
          >
            Preview link
          </Button>
        </Flex>
      </Modal>

      <Box component="form" onSubmit={form.onSubmit(submit)} h="100%">
        <Flex direction="column" align="center" gap={40} justify="center" h="100%">
          <Title order={1}>Edit link:</Title>
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
          <TextInput
            className={classes.Input}
            radius="xl"
            size="xl"
            placeholder="Edit token"
            w="100%"
            maw="36rem"
            icon={<IconKey size="1.6rem" />}
            styles={{
              icon: {
                paddingLeft: '6px',
              },
            }}
            {...form.getInputProps('editToken')}
          />
          <TextInput
            className={classes.Input}
            radius="xl"
            size="xl"
            placeholder="New URL"
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
          <CustomButton
            label="Save"
            disabled={loading || !form.isValid() || !form.isDirty()}
            iconRight={loading ? <IconLoader2 size="1.6rem" /> : <IconCheck size="1.8rem" />}
            type="submit"
          />
        </Flex>
      </Box>
    </>
  );
}
