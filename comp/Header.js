import React from 'react'
import { useColorMode } from "@chakra-ui/color-mode";
import { Flex, Heading, Stack, Button, Text } from '@chakra-ui/react';
import Head from "next/head";
import Link from 'next/link';
import styles from "../styles/Home.module.css";

export default function Header() {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
    <div className={styles.container}>

        <Head>
            <title>Tic-Tac-Toe</title>
            <meta name="description" content="Tic-Tac-Toe online!" />
            <link rel="icon" href="/icon.svg" />
        </Head>

        <Flex direction={{base:"column", md:"row"}} justifyContent={{base:"center", md: "space-between"}} alignItems="center" p='2'>
            <Heading><Link href='/'>Tic-Tac-Toe</Link></Heading>
            <Stack direction={{base: "column", md:"row"}} alignItems="center">
                <Button fontSize="lg" p="1" m="1" onClick={toggleColorMode}>
                    {colorMode === 'dark' ? "Dark" : "Light"} Mode on!
                </Button>
            </Stack>
        </Flex> 

    </div>
    
  )
}
