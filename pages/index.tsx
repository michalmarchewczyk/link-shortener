import Head from 'next/head';
import { ActionIcon, Box, Button, Text, Code, Flex, Modal, Switch, TextInput, Title, Tooltip } from '@mantine/core';
import { useState } from 'react';
import {
  IconForms,
  IconLink,
  IconChevronRight,
  IconLoader2,
  IconExternalLink,
  IconClipboard,
} from '@tabler/icons-react';
import classes from '@/styles/Forms.module.scss';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import validator from 'validator';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { LinkType } from '@/lib/server/models/linkModel';
import Link from 'next/link';

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);

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
  const [created, setCreated] = useState<null | LinkType>(null);
  const clipboard = useClipboard();
  const router = useRouter();

  const submit = async ({ url, slug, editable }: { url: string; slug: string; editable: boolean }) => {
    setLoading(true);
    setCreated(null);
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
      setCreated(data);
      if (!data.editable) {
        await router.push(`/view/${data.slug}`);
      } else {
        open();
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Create - Marchewczyk.link</title>
      </Head>

      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        classNames={{ content: classes.Modal, overlay: classes.ModalOverlay }}
        zIndex={10000}
        withinPortal={false}
      >
        <Flex direction="column" align="center" gap={12}>
          <Title order={2} fz={26} align="center" mb={10} mt={4}>
            Link created
          </Title>
          <Text fz={18} fw={600}>
            Edit token:
          </Text>
          <Code fz={16} fw={600} pl={12} pr={40} py={8} pos="relative">
            {created?.editToken}
            <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy to clipboard'} position="bottom" color="dark">
              <ActionIcon color="dark" variant="subtle" pos="absolute" right={6} top={6}>
                <IconClipboard size="1.5rem" onClick={() => clipboard.copy(created?.editToken)} />
              </ActionIcon>
            </Tooltip>
          </Code>
          <Text fz={16} fw={500} align="center" px={20}>
            Save this token, you will need it to edit this link later.
          </Text>
          <Button
            variant="subtle"
            color="dark"
            component={Link}
            href={`/view/${created?.slug}`}
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
          <Title order={1}>Shorten link:</Title>
          <TextInput
            className={classes.Input}
            radius="xl"
            size="xl"
            placeholder="Your URL"
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
            iconRight={loading ? <IconLoader2 size="1.6rem" /> : <IconChevronRight size="1.8rem" />}
            type="submit"
          />
        </Flex>
      </Box>
    </>
  );
}
