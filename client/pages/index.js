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
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { checkWinCon } from '../logic/WinCon'
import { io } from "socket.io-client";


export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()

  const matchStart = {one:"", two:"", three:"", four:"", five:"", six:"", seven:"", eight:"", nine:"",}
  const [grid, setGrid] = useState(matchStart)
  const [whosTurn, setWhosTurn] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOnePlayer, setIsOnePlayer] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [mySocket, setMySocket] = useState()

  useEffect(() => {
    const socket = io(`http://${window.location.hostname}:3001`);
    setMySocket(socket)
    socket.on('connect', () => {
      console.log(socket)
    })
  }, [])

  const handleClick = (square) =>{
    //if game is already over, prevent any further board changes
    if(gameOver){
      return null
    }

    //if an empty square is selected, all empty squares are initalized as '' (empty string)
    //which will return a falsey statement to enter the if.
    if(!grid[square]){
      const winner = checkWinCon(grid, setGrid, square, whosTurn, isOnePlayer)
      if(winner){
        setWhosTurn(winner)
        onOpen()
        setGameOver(true)
        return null
      }
      //changes whos turn it is if not a single player game
      if(!isOnePlayer) whosTurn === "X" ? setWhosTurn("O") : setWhosTurn("X")
    }
    //if a square is selected that is not empty, prompt the user as such.
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
      setIsOnePlayer(false),
      setGrid(matchStart)
    )
    :
    (
      setGameOver(false),
      setIsPlaying(true),
      setWhosTurn("X"),
      players === "two" ? setIsOnePlayer(false) : setIsOnePlayer(true) 
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
              {gameOver ? (`${whosTurn} won!`) : (`It is ${whosTurn}'s turn to play!`)}
          </Heading>
          </>):(<></>)}
  
        <Flex flexWrap="wrap" alignItems="center" justifyContent="center" maxW="1000px">

        {isPlaying ? ( <>

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

          </>)
          :
          (
            <>
            <Box as="button">
              <Center boxSize="200px" onClick={() => gameState('one')} fontSize="5em">Play!</Center>
            </Box>
            {/* Remove PVP option for later use when adding socket.io stuff */}
            {/* <Box as="button">
              <Center boxSize="200px" onClick={() => gameState('two')} fontSize="5em">PVP</Center>
            </Box> */}
            </>

          )}
        </Flex>
<>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Over!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>{whosTurn} won!</Center>
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
