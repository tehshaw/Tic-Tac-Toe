import React from 'react'
import { Box, Center } from "@chakra-ui/layout";
import Link from 'next/link';
import styles from '../styles/Home.module.css'


export default function index() {

  return (
    <div className={styles.main}>
    <>
        <Box>
            <Center fontSize="5em" m='10px'><Link href='/play/Offline'>Play NPC</Link></Center>
        </Box>
            
        <Box>
            <Center fontSize="5em" m='10px'><Link href='/play/Online'>Multi-Player</Link></Center>
        </Box>
    </>
    </div>
  )
  
}


