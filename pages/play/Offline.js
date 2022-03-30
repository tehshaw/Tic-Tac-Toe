import React from 'react'
import Wrapper from '../../comp/Wrapper'
import Game from '../../comp/Game'

export default function Offline() {
  return (
        <Wrapper>
            <Game gameMode={'offline'} />
        </Wrapper>
    )
}
