import React from 'react'
import { Box, Center } from "@chakra-ui/layout";
import Link from 'next/link';
import styles from '../styles/Home.module.css'


export default function index() {

  return (
    <div className={styles.main}>
    <>
        <Box>
            <Center boxSize="200px" fontSize="5em"><Link href='/play/offline'>Offline</Link></Center>
        </Box>
            
        <Box>
            <Center boxSize="200px" fontSize="5em"><Link href='/play/online'>Online</Link></Center>
        </Box>
    </>
    </div>
  )
  
}


