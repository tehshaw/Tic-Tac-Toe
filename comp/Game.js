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
  useColorModeValue,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { useRouter } from "next/router";
import { VscDebugRestart } from "react-icons/vsc";
import { Box, Flex, Heading, Text, Center } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import { checkWinCon } from '../logic/WinCon'
import { playerTwo } from '../logic/PlayerTwo';

export default function Game({gameMode, socket = null, inLobby = null}) {
  const router = useRouter();
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
      setGameInfo(`Both players in room. Game will start shortly.....`)
    })

    socket.once('myMove', args => {
      setGameInfo(`You will be playing as "${args}"`)
      onOpen()
      setMyMove(args)
      setGrid(matchStart)
    })

    socket.once('eBrake', (args) =>{
      inLobby(true)
      alert('The other player disconnected. Returning to Lobby....')
    })

   },[])

  useEffect(() => {
    if(!socket) return;

    // when a player makes a move in an online game, the move is sent to the server then sent back to each
    //client at the same time, checkMove is run to see if that move would create a win and changes whos turn
    //it is on each client. The server has no logic of turn order or move state.
    socket.on('move', (args) => {
      socket.off('move') //required to ensure multiple listeners are not added on every re-render
      console.log(`Received move ${args.move} for player ${args.player}`)
      checkMove(args.move, args.player, grid)
    })

    //used to monitor how many instances of the 'move' listener are currently mounted
    // console.log(socket._callbacks.$move)

    return () => {
      if(socket) socket.off('move')
    }
 
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

    // if its not your turn, prevent changes to the game board
    if(myMove !== whosTurn){
      alert('It is not your turn yet!')
      return;
    }

    // if a square is clicked that has already has a move, prevent over-writes
    if(grid[square]){
      grid[square] === whosTurn ? alert("You already went there!") :
      alert(grid[square] + " already went there!")
      return;
    }

    if(isOnePlayer){
      checkMove(square) // if its a one player game, call checkmove to validate winCon and change player turn
    }else{
      // send to sever the valid move and who made it, sending player as well to help prevent stale states
      socket.emit('move', { move : square, player: whosTurn }, () =>{
          console.log(`Sent server move ${square} for player ${whosTurn}`)
      })
    }
  }

  function checkMove(nextMove, player = whosTurn, myGrid = grid) {
      const isWinner = checkWinCon(myGrid, setGrid, nextMove, player)
      if(isWinner){
        winner.current = isWinner
        setGameInfo(`${winner.current} has won!`)
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

  const bg = useColorModeValue('blue.300', 'orange.200')

  return (
    <>
      
      {myMove ? (<>

          <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(4, 1fr)' gap={4} alignItems='center'>
            <GridItem gridArea='1/1/ span 2 / span 1' w='100%' textAlign='center'>
              {isOnePlayer ? (
                <Button
                  onClick={() => {
                    router.push('/')
                  }}
                >
                  Main Menu
                </Button>
              ):
              (
                <Button 
                  onClick={() => { 
                      inLobby(true);
                      socket.emit("leave");
                    }}
                >
                  Leave Game
                </Button>
              )}
  
            </GridItem>

            <GridItem colSpan={2} w='100%' textAlign='center'>
              <Heading bg={bg} p='2'borderRadius='10px'>You are playing as {myMove}</Heading>
            </GridItem>

            <GridItem colSpan={2} w='100%' textAlign='center'>
              <Heading mb='4' size='lg'>
                {gameOver ? (`${winner.current} won!`) : (`It is ${whosTurn}'s turn to play!`)}
              </Heading>
            </GridItem>

            <GridItem gridArea='1/4/ span 2 / span 1' w='100%' textAlign='center'> 
              {isOnePlayer && 
                <Button 
                  rightIcon={<VscDebugRestart />} 
                  onClick={() => startGame()}
                >
                  {gameOver ? ('Replay') : ('Restart')}
                </Button>
              }
              {!isOnePlayer && gameOver &&
                <Button 
                  rightIcon={<VscDebugRestart />} 
                  onClick={() => startGame()}
                >
                  Rematch?
                </Button>
              }
            </GridItem>

          </Grid>



 
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
            (<>
              <Heading textAlign={'center'} wordBreak='break-word'>{gameInfo}</Heading>

              <Button border='2px' onClick={() => { inLobby(true) }} m='2'>
              Back to Lobby
              </Button>
            </>
            )}
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tic-Tac-Toe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>{gameInfo}</Center>
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
