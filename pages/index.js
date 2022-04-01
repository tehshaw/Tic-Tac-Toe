import React from 'react'
import { Box, Center, Text } from "@chakra-ui/layout";
import Link from 'next/link';
import styles from '../styles/Home.module.css'


export default function index() {
  

  return (
    <div className={styles.main}>
    <>
        <Link href={"/play/Offline"} passHref>
          <Box className={styles.play} as='button'>
                <Text fontSize='5em'>Single Player</Text>
                Play against the computer.  
          </Box>
        </Link>
            
        <Link href={"/play/Online"} passHref>
          <Box className={styles.play} as='button'>
                <Text fontSize='5em'>Multi-Player</Text>
                Play online against other people. 
          </Box>
        </Link>
    </>
    </div>
  )
  
}


