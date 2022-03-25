import React from 'react'
import Game from '../../comp/Game'

export default function offline() {
  return (
    
        <Game gameMode={'offline'} socket={null} />
    )
}
