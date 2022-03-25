import React from 'react'
import { Box, Center } from "@chakra-ui/layout";
import Link from 'next/link';

export default function index() {

  return (
    <>
        <Box>
            <Center boxSize="200px" fontSize="5em"><Link href='/game/offline'>Offline</Link></Center>
        </Box>
            
        <Box>
            <Center boxSize="200px" fontSize="5em"><Link href='/game/online'>Online</Link></Center>
        </Box>
    </>

  )
  
}


