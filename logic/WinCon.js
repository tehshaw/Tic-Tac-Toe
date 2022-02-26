import { playerTwo } from "../logic/PlayerTwo";

//accepts the current state of the game board as GRID, the state function of SETGRID
//the last player move as PLAYERMOVE, who made the last move as WHOSTURN and boolean to track single player game
//this functions will check to see if the last played move caused a win con or not
//it will also make a play for the NPC in a single player game
export const checkWinCon = (grid, setGrid, playerMove, whosTurn, isOnePlayer) => {

    
    const tempGrid = {...grid, [playerMove]:whosTurn}

    function winner(tempGrid){
        const boardState = [
            (tempGrid["one"] === tempGrid["two"] && tempGrid["one"] === tempGrid["three"] && tempGrid["one"] != ""),
            (tempGrid["four"] === tempGrid["five"] && tempGrid["four"] === tempGrid["six"] && tempGrid["four"] != ""),
            (tempGrid["seven"] === tempGrid["eight"] && tempGrid["seven"] === tempGrid["nine"] && tempGrid["seven"] != ""),
            (tempGrid["one"] === tempGrid["four"] && tempGrid["one"] === tempGrid["seven"] && tempGrid["one"] != ""),
            (tempGrid["two"] === tempGrid["five"] && tempGrid["two"] === tempGrid["eight"] && tempGrid["two"] != ""),
            (tempGrid["three"] === tempGrid["six"] && tempGrid["three"] === tempGrid["nine"] && tempGrid["three"] != ""),
            (tempGrid["one"] === tempGrid["five"] && tempGrid["one"] === tempGrid["nine"] && tempGrid["one"] != ""),
            (tempGrid["three"] === tempGrid["five"] && tempGrid["three"] === tempGrid["seven"] && tempGrid["three"] != "")
        ]

        return boardState.find(winCon => winCon == true)
    }


    //if the last move matched a win con, update the boardstate GRID, and return the player who won
    if(winner(tempGrid)){
        setGrid({...tempGrid})
        return whosTurn
    }

    //if during a single player game, the player move did not create a win con, create a move for the NPC and check its win con
    if(isOnePlayer){
        const pcMove = playerTwo(tempGrid)

        tempGrid = {...tempGrid, [pcMove]:"O"}

        if(winner(tempGrid)){
            setGrid({...tempGrid})
            return "The NPC"
        }
    }
    
    //if no one wins or not a single player game, update board state on the screen
    setGrid({...tempGrid})

    return ""

}