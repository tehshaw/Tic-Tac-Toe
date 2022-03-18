import { useColorMode } from "@chakra-ui/color-mode";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { Box, Flex, Heading, Text, Stack, Center } from "@chakra-ui/layout";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { checkWinCon } from '../../logic/WinCon'

import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Home() {
  const matchStart = {one:"", two:"", three:"", four:"", five:"", six:"", seven:"", eight:"", nine:"",}
  const { colorMode, toggleColorMode } = useColorMode()
  const [grid, setGrid] = useState(matchStart)
  const [whosTurn, setWhosTurn] = useState('')
  const [isPlaying, setIsPlaying] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [gameOver, setGameOver] = useState(false)



  const handleClick = (square) =>{
    if(gameOver){
      return null
    }

    if(!grid[square]){
      const winner = checkWinCon(grid, setGrid, square, whosTurn)
      if(winner){
        setWhosTurn(winner)
        onOpen()
        setGameOver(true)
        return null
      }
    }
    else{
      grid[square] === whosTurn ? alert("You already went there!") :
      alert(grid[square] + " already went there!")
      return null
    }   

  }

  const gameState = (players) =>{

    {isPlaying ? (
      setIsPlaying(false),
      setWhosTurn(""),
      setGrid(matchStart)
    )
    :
    (
      setGameOver(false),
      setIsPlaying(true),
      setWhosTurn("X")
    )}

  }



  return (
    <div className={styles.container}>
      <Head>
        <title>Tic-Tac-Toe</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex direction={{base:"column", md:"row"}} justifyContent={{base:"center", md: "space-between"}} alignItems="center">
          <Heading>Tic-Tac-Toe!</Heading>
          <Stack direction={{base: "column", md:"row"}} alignItems="center">
            {isPlaying ? (
            <Box as="button" fontSize="lg" border="2px" p="1" m="1" borderRadius="5px" onClick={() => gameState()}>
                New Game
              </Box>
            ):(<></>)}
            <Button fontSize="lg" p="1" m="1" onClick={toggleColorMode}>
            {colorMode === 'dark' ? "Dark" : "Light"} Mode on!
              </Button>
          </Stack>
      </Flex>
      <main className={styles.main}>
        
        {isPlaying ? ( <>
          <Heading mb="4">
              {gameOver ? (`${whosTurn} has won!`) : (`It is ${whosTurn}'s turn to play!`)}
          </Heading>
          </>):(<></>)}
  
        <Flex flexWrap="wrap" alignItems="center" justifyContent="center" maxW="1000px">
             <>

            {Object.keys(grid).map(square => {
              return (<>
                <Box key={square} as="button" p="1" borderWidth='5px' borderColor="grey" boxSize="12em" backgroundColor="" flexBasis="30%"
                  onClick={() => handleClick(`${square}`)}
                >
                    <Text fontSize="5em" key={square}>{grid[square]}</Text>
                </Box>
                </>
              )
            })}

          </>
        </Flex>
<>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>We have a winner!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>{whosTurn} has won!</Center>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
