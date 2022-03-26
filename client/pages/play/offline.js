import React from 'react'
import Wrapper from '../../comp/Wrapper'
import Game from '../../comp/Game'

export default function offline() {
  return (
        <Wrapper>
            <Game gameMode={'offline'} socket={null} />
        </Wrapper>
    )
}
