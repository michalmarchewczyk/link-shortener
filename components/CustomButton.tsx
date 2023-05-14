import React from 'react';
import { Text, UnstyledButton } from '@mantine/core';
import { useHover, useMergedRef, useMouse } from '@mantine/hooks';
import classes from './CustomButton.module.scss';

function CustomButton({
  label,
  iconRight,
  iconLeft,
  onClick,
  disabled,
  type,
}: {
  label: string;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) {
  const { ref: refMouse, x, y } = useMouse();
  const { hovered, ref: refHover } = useHover();
  const ref = useMergedRef(refMouse, refHover);

  return (
    <UnstyledButton className={classes.Button} onClick={onClick} ref={ref} disabled={disabled} type={type}>
      {iconLeft}
      <Text>{label}</Text>
      {iconRight}
      <figure style={{ left: x, top: y, opacity: hovered ? 1 : 0 }} />
    </UnstyledButton>
  );
}

export default CustomButton;
