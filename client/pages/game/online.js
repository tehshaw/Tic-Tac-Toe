import React, { useEffect, useState } from 'react';
import io from "socket.io-client"; 
import Game from '../../comp/Game';
import { useRouter } from 'next/router';

export default function online() {
    const [socket, setSocket] = useState(null);
    const router = useRouter()



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
          alert("Disconnected from server. Redirecting to home page.")
          router.push('/')
        })
        socket.on('disconnect', () => {
          console.log("Disconnected from server")
          setSocket(null)
          alert("Disconnected from server. Redirecting to home page.")
          router.push('/')
        });

        return () => { if(socket) socket.disconnect()}

      }, [socket])

    return (

        <Game gameMode={'online'} socket={socket} />


    )
}
