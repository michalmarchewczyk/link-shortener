import React from 'react';
import { Text, UnstyledButton } from '@mantine/core';
import { useHover, useMergedRef, useMouse } from '@mantine/hooks';
import classes from './CustomButton.module.scss';

function CustomButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  const { ref: refMouse, x, y } = useMouse();
  const { hovered, ref: refHover } = useHover();
  const ref = useMergedRef(refMouse, refHover);

  return (
    <UnstyledButton className={classes.Button} onClick={onClick} ref={ref}>
      <Text>{label}</Text>
      {icon}
      <figure style={{ left: x, top: y, opacity: hovered ? 1 : 0 }} />
    </UnstyledButton>
  );
}

export default CustomButton;
