import React, { useEffect } from 'react'
import io from "socket.io-client";


export default function lobby() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io('http://localhost:3001'));
  },[])

  


  return (
    <div>
        
    </div>
  )
}
