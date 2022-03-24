import React from 'react'
import { Box, Center } from "@chakra-ui/layout";
import Link from 'next/link';

export default function index() {

  return (
    <>
        <Box>
            <Center boxSize="200px" fontSize="5em"><Link href='/game/single'>Offline</Link></Center>
        </Box>
            
        <Box>
            <Center boxSize="200px" fontSize="5em"><Link href='/game/lobby'>Online</Link></Center>
        </Box>
    </>

  )
  
}


