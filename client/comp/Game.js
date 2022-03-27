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
import { Box, Flex, Heading, Text, Center } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import { checkWinCon } from '../logic/WinCon'
import { playerTwo } from '../logic/PlayerTwo';

export default function Game({gameMode, socket}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const matchStart = {one:"", two:"", three:"", four:"", five:"", six:"", seven:"", eight:"", nine:"",}
  const [grid, setGrid] = useState(matchStart)
  const [whosTurn, setWhosTurn] = useState('')
  const [isOnePlayer, setIsOnePlayer] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const winner = useRef();
  const myMove = useRef('X')

  useEffect(() => {
    startGame(gameMode)

   },[])

  useEffect(() => {
    if(!socket) return; 

    socket.on('message', (args) => {
      console.log(args)
    })

    socket.on('move', (args) => {
      checkMove(args)
    })
 
  }, [socket]);

  useEffect(() => {
    if(isOnePlayer && whosTurn === 'O') {
      let pcMove = setTimeout(() => checkMove(playerTwo(grid)), 1500)
    }
  },[whosTurn])

  const handleClick = (square) =>{
    //if game is already over, prevent any further board changes
    if(gameOver){
      return;
    }

    if(myMove.current !== whosTurn){
      alert('It is not your turn yet!')
      return;
    }

    if(grid[square]){
      grid[nextMove] === whosTurn ? alert("You already went there!") :
      alert(grid[nextMove] + " already went there!")
      return;
    }

    if(isOnePlayer){
      checkMove(square)
    }else{
      socket.emit('move', { move : square })
    }
  }


  function checkMove(nextMove) {
    //if an empty square is selected, all empty squares are initalized as '' (empty string)
    //which will return a falsey statement to enter the if.
      const isWinner = checkWinCon(grid, setGrid, nextMove, whosTurn)
      if(isWinner){
        winner.current = isWinner
        onOpen()
        setGameOver(true)
        return;
      }
      whosTurn === 'X' ? setWhosTurn('O') : setWhosTurn('X')
  }

  const startGame = (gameType) =>{
      setGameOver(false)
      setGrid(matchStart)
      setWhosTurn('X') //// FIX HERE FOR MULTI PLAYER GAME
      gameType === "online" ? setIsOnePlayer(false) : setIsOnePlayer(true) 
  }

  return (
    <>
      <Heading mb="4">
        {gameOver ? (`${winner.current} won!`) : (`It is ${whosTurn}'s turn to play!`)}
      </Heading>

      <Flex flexWrap="wrap" alignItems="center" justifyContent="center" maxW="1000px">

        {Object.keys(grid).map(square => {
          return (<>
            <Box as="button" p="1" borderWidth='5px' borderColor="grey" boxSize="12em" backgroundColor="" flexBasis="30%"
              onClick={() => handleClick(`${square}`)} key={square}
            >
                <Text fontSize="5em">{grid[square]}</Text>
            </Box>
            </>
          )
        })}
      
      </Flex>

    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Over!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>{winner.current} won!</Center>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

  </>

  );
}
