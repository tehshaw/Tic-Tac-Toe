import React, { useEffect, useState } from 'react';
import io from "socket.io-client"; 
import Game from '../../comp/Game';
import { Box, Button, Center, Flex, Spacer } from '@chakra-ui/react';
import styles from '../../styles/Lobby.module.css'

export default function online() {
    const [socket, setSocket] = useState(null);
    const [rooms, setRooms] = useState(null)
    const [inLobby, setInLobby] = useState(true)

    useEffect(async ()  => {
        setSocket(io('http://localhost:3001'));

        return () => { if(socket) socket.disconnect()}
    },[])

    useEffect(() => {
        if(!socket) return; 

        socket.on('connect', () => {
          console.log("Connected as userID: ", socket.id)
        });
    
        socket.on('connect_error', () => {
          console.log('Unable to reach server. Online mode not avialable.')
          socket.disconnect();
          setSocket(null)
        //   alert("Disconnected from server. Redirecting to home page.")
        //   router.push('/')
        })
        socket.on('disconnect', () => {
          console.log("Disconnected from server")
          setSocket(null)
        //   alert("Disconnected from server. Redirecting to home page.")
        //   router.push('/')
        });

        socket.on('rooms', (args) => {
            console.log(args)
            setRooms(args)
        })

        socket.on('message', (args) => {
            console.log(args)
          })

        return () => { if(socket) socket.disconnect()}

      }, [socket])

    return (
 
        <div>
            <Flex flexWrap='warp' maxW='1000px' padding='1rem'>
                <Box flexBasis='35%'>
                    Connection Status:{socket ? ' Connected' : ' Not Connected'}
                </Box>
                <Spacer />
                <Box>
                    <Button onClick={() => socket.emit('report')}>Debug</Button>
                </Box>
            </Flex>

                {socket ? (
                    <>
                        {rooms ? (
                            <>
                                <Flex flexWrap='warp' padding='10px' justifyContent='center'>
                                    {inLobby ? (
                                    <>
                                        <Button className={styles.button} border='2px'
                                            onClick={() => {
                                                setInLobby(false)
                                                socket.emit('create')
                                            }}
                                        >
                                            Create Room
                                        </Button>


                                        <Button className={styles.button} border='2px'
                                            onClick={() => socket.disconnect()}
                                        >
                                            Disconnect
                                        </Button>
                                    </>
                                    ):
                                    (
                                    <>
                                        <Button className={styles.button} border='2px'
                                            onClick={() => {
                                                socket.emit('leave')
                                                setInLobby(true)
                                            }}
                                        >
                                            Leave Game
                                        </Button>
                                    </>
                                    )}
                                </Flex>

                                {inLobby ? (
                                    <Flex flexWrap='wrap' maxW='1000px' margin='2rem'>
                                        {rooms.map(room =>{
                                            return (<>
                                            <Box as='button' border='2px' borderRadius='md' m={4} boxSize='10rem'>
                                                {room}
                                            </Box>
                                            </>)
                                        })}
                                    </Flex>
                                ):(
                                    <Game gameMode={'online'} socket={socket} />
                                )}
  

                            </>
                        ):(
                            <Center>
                                <h1>Loading Rooms...</h1>
                            </Center>
                        )}
                    </>
                ):(
                    <>
                        <h1>No server connection!</h1>
                    </>
                )}
            {/* <Game gameMode={'online'} socket={socket} /> */}

        </div>



    )
}
