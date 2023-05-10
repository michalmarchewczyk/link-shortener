import React from 'react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

function ThemeSwitch() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="subtle"
      color={dark ? 'gray' : 'dark'}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      pos="fixed"
      bottom={20}
      right={20}
      size="xl"
      radius="md"
    >
      {dark ? <IconSun size="1.6rem" /> : <IconMoonStars size="1.6rem" />}
    </ActionIcon>
  );
}

export default ThemeSwitch;
