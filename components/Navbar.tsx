import React, { useState } from 'react';
import { Burger, Container, MediaQuery, Tooltip } from '@mantine/core';
import { useHover, useMergedRef, useMouse } from '@mantine/hooks';
import logotype from '@/assets/logotype-link.svg';
import logo from '@/assets/logo.svg';
import github from '@/assets/github.svg';
import Link from 'next/link';
import Image from 'next/image';
import classes from './Navbar.module.scss';

function Navbar() {
  const [opened, setOpened] = useState(false);
  const { ref: refMouse, x, y } = useMouse();
  const { hovered, ref: refHover } = useHover();
  const ref = useMergedRef(refMouse, refHover);

  return (
    <>
      <MediaQuery smallerThan="sm" styles={{ display: 'none !important' }}>
        <Container size="xl" className={classes.NavbarContainer}>
          <div className={classes.Navbar} ref={ref}>
            <Link href="/">
              <MediaQuery styles={{ display: 'none !important' }} smallerThan="md">
                <Image src={logotype} alt="" height={80} width={346} />
              </MediaQuery>
              <MediaQuery styles={{ display: 'none !important' }} largerThan="md">
                <Image src={logo} alt="" height={80} width={80} />
              </MediaQuery>
            </Link>
            <div />
            <figure style={{ left: x, top: y, opacity: hovered ? 1 : 0 }} />
            <Link href="/" className={classes.Link}>
              Create
            </Link>
            <Link href="/view" className={classes.Link}>
              View
            </Link>
            <Link href="/edit" className={classes.Link}>
              Edit
            </Link>
            <Tooltip
              label="Source code"
              position="bottom"
              color="black"
              offset={-10}
              openDelay={500}
              withinPortal
              zIndex={100000}
            >
              <a href="https://github.com/michalmarchewczyk/link-shortener" target="_blank" rel="noreferrer">
                <Image src={github} alt="Source code" height={30} width={30} />
              </a>
            </Tooltip>
          </div>
        </Container>
      </MediaQuery>
      <MediaQuery largerThan="sm" styles={{ display: 'none !important' }}>
        <div className={classes.NavbarMobile} style={{ height: opened ? 'calc(100vh - 30px)' : '80px' }}>
          <Link href="/" onClick={() => setOpened(false)}>
            <Image src={logo} alt="" height={80} width={80} />
          </Link>
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size="lg"
            styles={{
              burger: {
                height: '4px !important',
                '&::before': {
                  height: '4px !important',
                },
                '&::after': {
                  height: '4px !important',
                },
              },
            }}
          />
          <div className={classes.LinksMobile}>
            <Link href="/" className={classes.LinkMobile} onClick={() => setOpened(false)}>
              Create
            </Link>
            <Link href="/view" className={classes.LinkMobile} onClick={() => setOpened(false)}>
              View
            </Link>
            <Link href="/edit" className={classes.LinkMobile} onClick={() => setOpened(false)}>
              Edit
            </Link>
            <a href="https://github.com/michalmarchewczyk/link-shortener" target="_blank" rel="noreferrer">
              <Image src={github} alt="Source code" />
            </a>
          </div>
        </div>
      </MediaQuery>
    </>
  );
}

export default Navbar;
