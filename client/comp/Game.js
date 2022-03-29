import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
import { Box, Flex, Heading, Text, Center } from "@chakra-ui/layout";
import { useCallback, useEffect, useRef, useState } from "react";
import { checkWinCon } from '../logic/WinCon'
import { playerTwo } from '../logic/PlayerTwo';

export default function Game({gameMode, socket}) {
  const matchStart = {one:"", two:"", three:"", four:"", five:"", six:"", seven:"", eight:"", nine:""}

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [grid, setGrid] = useState(matchStart)
  const [whosTurn, setWhosTurn] = useState('')
  const [isOnePlayer, setIsOnePlayer] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameInfo, setGameInfo] = useState('Waiting for another player to connect....')
  const [myMove, setMyMove] = useState('')

  const winner = useRef();

  useEffect(() => {
    startGame()

    if(!socket) return;

    socket.once('ready', (args) => {
      setGameInfo('Both players in room. Game will start shortly.....')
    })

    socket.once('myMove', args => {
      alert(`You will be playing as "${args}"`)
      setMyMove(args)
      setGrid(matchStart)
    })

   },[])

  useEffect(() => {
    if(!socket) return;

    socket.on('move', (args) => {
      console.log("new move received", args)
      socket.off('move') //required to ensure multiple listeners are not added on every re-render
      checkMove(args.move, args.player, grid)
    })

    console.log(socket._callbacks.$move)
 
  }, [socket, grid]);

  useEffect(() => {
    if(isOnePlayer && whosTurn === 'O') {
      let pcMove = setTimeout(() => checkMove(playerTwo(grid)), 1500)
    }
  },[whosTurn])
  

  function handleClick(square){
    //if game is already over, prevent any further board changes
    if(gameOver){
      return;
    }

    if(myMove !== whosTurn){
      alert('It is not your turn yet!')
      return;
    }

    if(grid[square]){
      grid[square] === whosTurn ? alert("You already went there!") :
      alert(grid[square] + " already went there!")
      return;
    }

    if(isOnePlayer){
      checkMove(square)
    }else{
      socket.emit('move', { move : square, player: whosTurn }, () =>{
          console.log(`Sent server move ${square} for player ${whosTurn}`)
      })
    }
  }

  function checkMove(nextMove, player = whosTurn, myGrid = grid) {
      const isWinner = checkWinCon(myGrid, setGrid, nextMove, player)
      if(isWinner){
        winner.current = isWinner
        onOpen()
        setGameOver(true)
        return;
      }
      player === 'X' ? setWhosTurn('O') : setWhosTurn('X')
  }

  function startGame(){
      setGameOver(false)
      setGrid(matchStart)
      setWhosTurn('X')
      if(gameMode === 'offline'){
        setIsOnePlayer(true)
        setMyMove('X')
      }else{
        setIsOnePlayer(false)
      }
  }

  return (
    <>
      {isOnePlayer && <Button onClick={() => startGame()}>Retart</Button>}
      {myMove ? (<>
          <Heading bg='green.800' p='2' borderRadius={'10px'}>You are playing as {myMove}</Heading>
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
      </>):
            (<Heading>{gameInfo}</Heading>)}
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
