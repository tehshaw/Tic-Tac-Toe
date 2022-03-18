
export const updateGameState = () =>{


        {isPlaying ? (
          setIsPlaying(false),
          setWhosTurn(""),
          setIsOnePlayer(false),
          setGrid(matchStart)
        )
        :
        (
          setIsPlaying(true),
          setWhosTurn("X"),
          players === "two" ? setIsOnePlayer(false) : setIsOnePlayer(true) 
        )}
    

}